const DelayedBuilderAI = extend(BuilderAI, {
    // These are instance fields (each unit gets its own)
    cooldown: 0,
    lastPlansCount: -1,
    vanillaAI: null,

    init() {
        this.vanillaAI = new BuilderAI();
        this.cooldown = 0;
        this.lastPlansCount = -1;
    },

    updateUnit() {
        if (this.vanillaAI.unit != this.unit) {
            this.vanillaAI.unit = this.unit;
        }

        let queue = this.unit.team.data().plans;
        let currentPlans = queue.size;

        if (this.lastPlansCount == -1) {
            this.lastPlansCount = currentPlans;
        }

        if (currentPlans > this.lastPlansCount) {
            this.cooldown = 30 * 60;
        }
        this.lastPlansCount = currentPlans;

        if (this.cooldown > 0) {
            this.cooldown -= Time.delta;

            this.unit.clearBuilding();
            this.unit.plans.clear();

            let core = this.unit.closestCore();
            if (core != null && !this.unit.within(core, 150)) {
                this.moveTo(core, 120);
            }
            return;
        }

        this.vanillaAI.updateUnit();
    }
});

let sandDrone = Vars.content.getByName(ContentType.unit, "sand-stormv2-sand-drone");

if (sandDrone != null) {
    sandDrone.controller = prov(() => new DelayedBuilderAI());
    print("[DelayedBuilderAI] Assigned to unit: " + sandDrone.name);
} else {
    print("[DelayedBuilderAI] ERROR: Unit 'sand-stormv2-sand-drone' not found!");
}