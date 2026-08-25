const DelayedBuilderAI = () => {
    let vanillaAI = new BuilderAI();
    let cooldown = 0;
    let lastPlansCount = -1;

    return extend(BuilderAI, {
        updateUnit() {
            vanillaAI.unit = this.unit;

            let queue = this.unit.team.data().plans;
            let currentPlans = queue.size;

            if (lastPlansCount == -1) {
                lastPlansCount = currentPlans;
            }

            if (currentPlans != lastPlansCount) {
                cooldown = 300;
            }
            lastPlansCount = currentPlans;

            if (cooldown > 0) {
                cooldown -= Time.delta;
                this.unit.clearBuilding();

                let core = this.unit.closestCore();
                if (core != null && !this.unit.within(core, 150)) {
                    this.moveTo(core, 120);
                }
                return;
            }

            vanillaAI.updateUnit();
        }
    });
};

let sandDrone = Vars.content.getByName(ContentType.unit, "sand-stormv2-sand-drone");
if (sandDrone != null) {
    sandDrone.controller = prov(() => DelayedBuilderAI());
}