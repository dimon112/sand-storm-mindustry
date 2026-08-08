const quicksandfloor = extend(Floor, "quick-sand-floor", {
    drawBase(tile) {
        let region = this.variantRegions[Math.abs(tile.pos()) % this.variants];
        Draw.rect(region, tile.drawx(), tile.drawy());
    }
});

quicksandfloor.isLiquid = true;
quicksandfloor.speedMultiplier = 0.65;
quicksandfloor.drownTime = 133.33;
quicksandfloor.variants = 3;
quicksandfloor.walkEffect = Fx.ripple;
quicksandfloor.drownUpdateEffect = Fx.bubble;

Events.run(Trigger.draw, () => {
    if (!Vars.world || !Vars.state.isGame()) return;

    let camera = Core.camera;
    let minX = Math.max(0, Math.floor((camera.position.x - camera.width / 2) / Vars.tilesize) - 1);
    let maxX = Math.min(Vars.world.width() - 1, Math.ceil((camera.position.x + camera.width / 2) / Vars.tilesize) + 1);
    let minY = Math.max(0, Math.floor((camera.position.y - camera.height / 2) / Vars.tilesize) - 1);
    let maxY = Math.min(Vars.world.height() - 1, Math.ceil((camera.position.y + camera.height / 2) / Vars.tilesize) + 1);

    let steppedTime = Math.floor(Time.time / 4.0) * 4.0;

    Draw.z(Layer.floor + 0.01); //draw this 0.01 layer above floor layer so now it should animateee

    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            let tile = Vars.world.tile(x, y);

            if (tile && tile.floor() === quicksandfloor) {
                let moveY = Math.sin((steppedTime + (x + y) * 10) / 25.0) * 1.2;
                Draw.color(0.95, 0.95, 0.95, 1.0);
                let region = quicksandfloor.variantRegions[Math.abs(tile.pos()) % quicksandfloor.variants];
                Draw.rect(region, tile.drawx(), tile.drawy() + moveY, Vars.tilesize + 0.8, Vars.tilesize + 0.8);

                Draw.color();
            }
        }
    }
});