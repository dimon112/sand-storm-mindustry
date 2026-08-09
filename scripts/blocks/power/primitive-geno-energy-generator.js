const customGen = extend(ItemLiquidGenerator, "primitive-geno-energy-generator", {
    targetGeno: null,
    targetUndoym: null,

    init() {
        this.super$init();
        
        let itemsSeq = Vars.content.items();
        for (let i = 0; i < itemsSeq.size; i++) {
            let item = itemsSeq.get(i);
            
            if (item.name === "geno" || item.name.endsWith("-geno")) {
                this.targetGeno = item;
            }
            if (item.name === "undoym" || item.name.endsWith("-undoym")) {
                this.targetUndoym = item;
            }
        }
    },

    getItemEfficiency(item) {
        if (this.targetGeno !== null && item === this.targetGeno) {
            return 0.88;
        }
        if (this.targetUndoym !== null && item === this.targetUndoym) {
            return 0.50;
        }
        return 0;
    },

    acceptItem(building, item) {
        return this.getItemEfficiency(item) > 0 && building.items.get(item) < this.itemCapacity;
    }
});