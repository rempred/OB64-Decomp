#include "game/effect_commands_e09.h"
#include "game/effect_dispatch_e07.h"
#include "game/effect_callbacks_p02.h"

#include "game/effect_task_700b0.h"

extern u8 *p01_context_80220F68;

extern void func_00262830(s16);


s32 func_0026e520(u32 command, void *payload)
{
    E09State700B0 *state = payload;
    /* Retail narrows the command before comparing and forwarding it. */
    u16 message = command;
    s32 result = 0;

    if (message == 0x100) {
        state->value_44 = (u32)p01_context_80220F68;
        state->value_40 = func_0026C010(0x37);
        state->value_40->value_10 = state->value_44;
        state->value_40->value_0A |= 0x2000;
        state->value_4C = 0x20;
        state->value_4E = 0xC8;
        state->value_50 = 0xFF;
        state->value_52 = 0x3C;
        func_00262830(0x1000);
    } else {
        /* Forward the registered payload itself; this preserves its retail lifetime. */
        result = func_002700B0(message, payload);
    }
    return result;
}
