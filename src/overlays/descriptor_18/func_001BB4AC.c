struct Panel;
#include "game/panel_list_aliases.h"

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
void D_8017C384(struct Panel *);
s32 func_001BB4AC(ScriptCtx *c) {
    void *o = D_8017F334(c->pc[3] | 0x5200);
    if (o == ((void *)0)) {
        for (;;) {
        }
    }
    if (c->pc[2] != 0) {
        D_8017C384(o);
    } else {
        D_8017C2FC(o);
    }
    c->pc += 4;
    return 0;
}
