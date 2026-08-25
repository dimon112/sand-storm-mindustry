const DelayedBuilderAI = () => {
    return extend(BuilderAI, {
        rebuildDelay: 1800, // 30 seconds (60 ticks * 30)
        cooldown: 0,
        lastPlansCount: 0,

        updateUnit() {
            let currentPlans = this.unit.team.plans.size;

            if (currentPlans > this.lastPlansCount) {
                this.cooldown = this.rebuildDelay;
            }
            this.lastPlansCount = currentPlans;
            if (this.cooldown > 0) {
                this.cooldown -= Time.delta;
                this.unit.clearBuilding();
                
                let core = this.unit.closestCore();
                if (core != null && !this.unit.within(core, 150)) {
                    this.moveTo(core, 120);
                }
                
                return;
            }
            this.super$updateUnit();
        }
    });
};

const sandDrone = extend(UnitType, "sand-drone", {});

sandDrone.controller = prov(() => DelayedBuilderAI());