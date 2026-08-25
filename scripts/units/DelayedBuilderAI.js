const DelayedBuilderAI = extend(BuilderAI, {
    cooldown: 0,
    lastPlansCount: -1,
    vanillaAI: null,

    updateUnit() {
        if (this.vanillaAI == null) {
            this.vanillaAI = new BuilderAI();
            this.vanillaAI.unit = this.unit;
        }

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
if (sandDrone == null) {
    sandDrone = Vars.content.getByName(ContentType.unit, "sand-stormV2-sand-drone");
}

if (sandDrone != null) {
    sandDrone.controller = prov(() => new DelayedBuilderAI());
}

Events.on(UnitSpawnEvent, e => {
    if (e.unit.type == sandDrone && !(e.unit.controller() instanceof DelayedBuilderAI)) {
        e.unit.controller(new DelayedBuilderAI());
    }
});