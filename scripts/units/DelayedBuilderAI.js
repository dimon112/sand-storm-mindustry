const DelayedBuilderAI = () => {
    return extend(BuilderAI, {
        rebuildDelay: 1800, // 30 seconds bleh
        cooldown: 0,
        lastPlansCount: 0,

        updateUnit() {
            let teamData = this.unit.team.data();
            let currentPlans = teamData.plans.size;

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