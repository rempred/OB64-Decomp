#include "overlays/descriptor_18_script_records.h"

typedef struct {
    u8 unk00;
    u8 state;
    u8 unk02[2];
    u8 *base;
    u8 *volatile pc;
    u16 depth;
    u8 unk0E[2];
    u8 *stack[4];
    u16 loopDepth;
    u16 loopCount[4];
    u8 unk2A[2];
    u16 cond;
} ScriptCtx;
s32 func_001BBA7C(ScriptCtx *ctx) {
    u8 *o = func_001BBFFC(ctx->pc[1]);
    if (*o != 1) {
        for (;;) {
        }
    }
    func_001BD378(o, *(u16 *)(ctx->pc + 2), 1);
    ctx->pc += 4;
    return 0;
}
