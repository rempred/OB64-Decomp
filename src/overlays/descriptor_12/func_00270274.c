#include "game/effect_callbacks_p02.h"
#include "game/effect_commands_e09.h"

extern s32 D_80220F68;

void func_00270274(s32 a) {
    D_80220F68 = a;
    func_00262AB0(func_002700B0);
}
