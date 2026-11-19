#include "common/types.h"

typedef struct CutsceneAudioContext CutsceneAudioContext;

typedef struct CutsceneAudioEnvelope {
    s16 step;
    s16 gain;
    s16 remaining;
    s16 route;
} CutsceneAudioEnvelope;

typedef struct CutsceneAudioState {
    CutsceneAudioContext *contexts[7];
    CutsceneAudioEnvelope *envelope;
} CutsceneAudioState;

typedef struct AudioGainEntry {
    s32 gain;
    u8 unk04[4];
} AudioGainEntry;

extern CutsceneAudioState table_00286878;
extern AudioGainEntry D_800EB2E0[];
extern void *func_00070F30(s32 size);
extern void bzero(void *memory, s32 size);

void func_00283224(s32 route, s32 gainIndex, s32 step, s32 duration) {
    s32 halfStep = step / 2;

    if (table_00286878.envelope == 0) {
        /* Retail passes 4 to both calls before writing the four halfwords. */
        table_00286878.envelope = func_00070F30(4);
        bzero(table_00286878.envelope, 4);
        if ((u32)route - 2U < 5U) {
            table_00286878.envelope->gain = 0x7FFF;
        } else {
            table_00286878.envelope->gain = D_800EB2E0[gainIndex].gain;
        }
        if (step > 0) {
            /* The gain adjustment wraps before being stored in a halfword. */
            table_00286878.envelope->gain = (u16)table_00286878.envelope->gain - (u32)halfStep * (u32)duration;
        }
    }
    table_00286878.envelope->step = halfStep;
    table_00286878.envelope->remaining = duration;
    table_00286878.envelope->route = route;
}
