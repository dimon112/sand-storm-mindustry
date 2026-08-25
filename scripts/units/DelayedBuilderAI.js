const DelayedBuilderAI = () => {
    let vanillaAI = new BuilderAI();
    let cooldown = 0;
    let lastPlansCount = 0;

    return extend(BuilderAI, {
        updateUnit() {
            let teamData = this.unit.team.data();
            let currentPlans = teamData.plans.size;

            if (currentPlans > lastPlansCount) {
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
            
            this.super$updateUnit();
        }
    });
};

const sandDrone = Vars.content.getByName(ContentType.unit, "sand-stormv2-sand-drone");
if (sandDrone != null) {
    sandDrone.controller = prov(() => DelayedBuilderAI());
}