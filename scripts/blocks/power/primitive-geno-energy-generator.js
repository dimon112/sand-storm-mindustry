
const findItem = (name) => Vars.content.items().find(i => i.name === name || i.name.endsWith("-" + name));

const customGen = extend(ItemLiquidGenerator, "primitive-geno-energy-generator", {
    efficiencies: null,

    init() {
        this.super$init();
        this.efficiencies = new ObjectFloatMap();
        const geno = findItem("geno");
        const undoym = findItem("undoym");

        if (geno != null) this.efficiencies.put(geno, 0.88);     // 88%
        if (undoym != null) this.efficiencies.put(undoym, 0.50); // 50%
    },

    
    getItemEfficiency(item) {
        if (this.efficiencies != null && this.efficiencies.containsKey(item)) {
            return this.efficiencies.get(item, 0);
        }
        return 0; 
    },

    acceptItem(building, item) {
        return this.getItemEfficiency(item) > 0 && building.items.get(item) < this.itemCapacity;
    }
});