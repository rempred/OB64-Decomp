#include "game/battle_predicates.h"
#include "game/effect_math_e04.h"

typedef struct {
    float x;
    float y;
    float z;
} E04Vec3;

extern int battle_actor_is_side_one(void *);

void func_0026C4EC(void *actor, void *outputView)
{
    E04Vec3 *output = (E04Vec3 *)outputView;
    int flag8 = battle_actor_is_side_one(actor);

    if (flag8 != battle_actor_has_flag_5(actor)) {
        output->x = 1.0f;
    } else {
        output->x = -1.0f;
    }
    output->y = 0.0f;
    output->z = 0.0f;
}
