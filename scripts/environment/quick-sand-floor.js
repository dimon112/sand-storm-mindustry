const quicksandfloor = extend(Floor, "quick-sand-floor", {
    drawBase(tile) {
        let moveX = Math.sin((Time.time + tile.x * 12 + tile.y * 8) / 30.0) * 0.3;
        let moveY = Math.cos((Time.time + tile.x * 8 + tile.y * 12) / 30.0) * 0.3;

        Draw.color(0.85, 0.85, 0.85, 1.0);

        let region = this.variantRegions[Math.abs(tile.pos()) % this.variants];
        Draw.rect(region, tile.drawx() + moveX, tile.drawy() + moveY);

        Draw.color();
    }
});

quicksandfloor.isLiquid = true;
quicksandfloor.speedMultiplier = 0.65;
quicksandfloor.drownTime = 133.33;
quicksandfloor.variants = 3;

quicksandfloor.walkEffect = Fx.ripple;
quicksandfloor.drownUpdateEffect = Fx.bubble;