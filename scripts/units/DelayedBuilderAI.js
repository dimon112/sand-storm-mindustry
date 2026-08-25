const DelayedBuilderAI = () => {
    let vanillaAI = new BuilderAI();
    let cooldown = 0;
    let lastPlansCount = -1;

    return extend(BuilderAI, {
        updateUnit() {
            vanillaAI.unit = this.unit;

            let queue = this.unit.team.data().plans;
            let currentPlans = queue.size;

            // Первичная инициализация
            if (lastPlansCount == -1) {
                lastPlansCount = currentPlans;
            }

            // Если появились НОВЫЕ планы (разрушения), сбрасываем таймер на 30 секунд
            if (currentPlans > lastPlansCount) {
                cooldown = 30 * 60; // 30 секунд в тиках
            }
            lastPlansCount = currentPlans;

            // Если таймер активен — НЕ строим, отходим к ядру
            if (cooldown > 0) {
                cooldown -= Time.delta;

                // Прерываем всё текущее строительство
                this.unit.clearBuilding();
                this.unit.plans.clear();

                let core = this.unit.closestCore();
                if (core != null && !this.unit.within(core, 150)) {
                    this.moveTo(core, 120);
                }
                return;
            }

            // Таймер истёк — работаем как обычный BuilderAI
            vanillaAI.updateUnit();
        }
    });
};

let sandDrone = Vars.content.getByName(ContentType.unit, "sand-stormv2-sand-drone");
if (sandDrone != null) {
    sandDrone.controller = prov(() => new DelayedBuilderAI());
}