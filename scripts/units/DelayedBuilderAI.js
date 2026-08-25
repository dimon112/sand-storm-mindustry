const DelayedBuilderAI = extend(BuilderAI, {
    cooldown: 0,
    lastPlansCount: -1,

    updateUnit() {
        print("[DBAI] updateUnit running on " + this.unit.type.name + " team=" + this.unit.team.id);

        let queue = this.unit.team.data().plans;
        let currentPlans = queue.size;
        print("[DBAI] plans=" + currentPlans + " last=" + this.lastPlansCount + " cd=" + this.cooldown);

        if (this.lastPlansCount == -1) {
            this.lastPlansCount = currentPlans;
        }

        if (currentPlans > this.lastPlansCount) {
            print("[DBAI] Plans increased, resetting cooldown to 30s");
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

        print("[DBAI] Cooldown done, calling super$updateUnit");
        this.super$updateUnit();
    }
});

let sandDrone = Vars.content.getByName(ContentType.unit, "sand-stormv2-sand-drone");
if (sandDrone == null) {
    sandDrone = Vars.content.getByName(ContentType.unit, "sand-stormV2-sand-drone");
}

print("[DBAI] Script loaded. Unit found: " + (sandDrone != null ? sandDrone.name : "NULL"));

if (sandDrone != null) {
    sandDrone.controller = prov(() => new DelayedBuilderAI());
    print("[DBAI] Set controller on unit type");
}

Events.on(UnitSpawnEvent, e => {
    print("[DBAI] SpawnEvent: " + e.unit.type.name + " controller=" + e.unit.controller().getClass().getSimpleName());
    if (e.unit.type == sandDrone) {
        print("[DBAI] SpawnEvent matches our unit!");
        if (!(e.unit.controller() instanceof DelayedBuilderAI)) {
            print("[DBAI] Reassigning controller via event...");
            e.unit.controller(new DelayedBuilderAI());
            print("[DBAI] New controller: " + e.unit.controller().getClass().getSimpleName());
        }
    }
});

var checkTimer = 0;
Events.run(Trigger.update, () => {
    checkTimer += Time.delta;
    if (checkTimer > 120) {
        checkTimer = 0;
        Groups.unit.each(u => {
            if (u.type == sandDrone) {
                let ctrlName = u.controller().getClass().getSimpleName();
                print("[DBAI] Periodic check unit=" + u.id + " controller=" + ctrlName);
                if (!(u.controller() instanceof DelayedBuilderAI)) {
                    print("[DBAI] Forcing controller assignment!");
                    u.controller(new DelayedBuilderAI());
                }
            }
        });
    }
});