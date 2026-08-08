const quicksandfloor = extend(Floor, "quick-sand-floor", {
    drawBase(tile) {
        let region = this.variantRegions[Math.abs(tile.pos()) % this.variants];
        Draw.rect(region, tile.drawx(), tile.drawy());
    }
});

quicksandfloor.placeableOn = true;
quicksandfloor.isLiquid = true;

quicksandfloor.speedMultiplier = 0.65;
quicksandfloor.drownTime = 133.33;
quicksandfloor.variants = 3;
quicksandfloor.walkEffect = Fx.ripple;
quicksandfloor.drownUpdateEffect = Fx.bubble;
quicksandfloor.liquidMultiplier = 0.4;

Events.on(ContentInitEvent, () => {
    let foundLiquid = Vars.content.liquids().find(l => l.name.includes("quicksand"));
    quicksandfloor.liquidDrop = foundLiquid || Liquids.water;
});

Events.run(Trigger.update, () => {
    if (!Vars.world || !Vars.state.isGame()) return;

    if (Math.floor(Time.time) % 30 === 0) {
        let camera = Core.camera;
        let minX = Math.max(0, Math.floor((camera.position.x - camera.width / 2) / Vars.tilesize) - 1);
        let maxX = Math.min(Vars.world.width() - 1, Math.ceil((camera.position.x + camera.width / 2) / Vars.tilesize) + 1);
        let minY = Math.max(0, Math.floor((camera.position.y - camera.height / 2) / Vars.tilesize) - 1);
        let maxY = Math.min(Vars.world.height() - 1, Math.ceil((camera.position.y + camera.height / 2) / Vars.tilesize) + 1);

        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                let tile = Vars.world.tile(x, y);

                if (tile && tile.floor() === quicksandfloor && tile.build) {
                    let l = Vars.world.tile(x - 1, y);
                    let r = Vars.world.tile(x + 1, y);
                    let t = Vars.world.tile(x, y - 1);
                    let b = Vars.world.tile(x, y + 1);

                    let isEdge = (l && l.floor() !== quicksandfloor) ||
                                 (r && r.floor() !== quicksandfloor) ||
                                 (t && t.floor() !== quicksandfloor) ||
                                 (b && b.floor() !== quicksandfloor);

                    let isPump = (tile.build.block instanceof Pump) || (tile.build.block.name && tile.build.block.name.includes("pump"));

                    if (!isPump || !isEdge) {
                        tile.build.damage(3.0);
                        Fx.bubble.at(tile.worldx(), tile.worldy());
                    }
                }
            }
        }
    }
});

Events.run(Trigger.draw, () => {
    if (!Vars.world || !Vars.state.isGame()) return;

    let camera = Core.camera;
    let minX = Math.max(0, Math.floor((camera.position.x - camera.width / 2) / Vars.tilesize) - 1);
    let maxX = Math.min(Vars.world.width() - 1, Math.ceil((camera.position.x + camera.width / 2) / Vars.tilesize) + 1);
    let minY = Math.max(0, Math.floor((camera.position.y - camera.height / 2) / Vars.tilesize) - 1);
    let maxY = Math.min(Vars.world.height() - 1, Math.ceil((camera.position.y + camera.height / 2) / Vars.tilesize) + 1);

    let steppedTime = Math.floor(Time.time / 6.0) * 6.0;
    let size = Vars.tilesize + 0.8;

    Draw.z(Layer.floor + 0.01);
    Draw.color(0.98, 0.98, 0.98, 1.0);

    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            let tile = Vars.world.tile(x, y);

            if (tile && tile.floor() === quicksandfloor) {
                let moveY = Math.sin((steppedTime + (x + y) * 10) / 25.0) * 0.5;
                let region = quicksandfloor.variantRegions[Math.abs(tile.pos()) % quicksandfloor.variants];

                Draw.rect(region, tile.drawx(), tile.drawy() + moveY, size, size);
            }
        }
    }

    Draw.color();
});