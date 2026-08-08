const quicksandfloor = extend(Floor, "quick-sand-floor", {
    drawBase(tile) {
        let moveY = Math.sin((Time.time + (tile.x + tile.y) * 12) / 35.0) * 0.4;
        Draw.color(0.95, 0.95, 0.95, 1.0);
        let region = this.variantRegions[Math.abs(tile.pos()) % this.variants];
        let tileSize = Vars.tilesize + 0.8; 
        Draw.rect(region, tile.drawx(), tile.drawy() + moveY, tileSize, tileSize);

        Draw.color();
    }
});

quicksandfloor.isLiquid = true;
quicksandfloor.speedMultiplier = 0.65;
quicksandfloor.drownTime = 133.33;
quicksandfloor.variants = 3;

quicksandfloor.walkEffect = Fx.ripple;
quicksandfloor.drownUpdateEffect = Fx.bubble;