#include "game/effect_math_e04.h"

extern void *func_0020C478(unsigned int);
extern void func_00023460(const void *, void *, unsigned int);

void func_0026C994(unsigned int actor_index, void *destination)
{
    void **primary_children = func_0020C478(actor_index);

    func_00023460((unsigned char *)primary_children[0] + 0x44, destination, 0x50);
}
