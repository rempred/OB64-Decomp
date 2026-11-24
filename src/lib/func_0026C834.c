#include "game/effect_math_e04.h"

typedef struct {
    float x;
    float y;
    float z;
} E04Vec3;

extern void *func_0020C478(unsigned int);
extern int func_0025F770(void *);
extern int func_0025F7C0(void *);
extern int func_0025F798(void *);

void func_0026C834(unsigned int actor_index, void *outputView)
{
    E04Vec3 *output = (E04Vec3 *)outputView;
    void *actor = func_0020C478(actor_index);

    output->x = (float)func_0025F770(actor);
    output->z = (float)func_0025F7C0(actor);
    output->y = (float)func_0025F798(actor);
}
