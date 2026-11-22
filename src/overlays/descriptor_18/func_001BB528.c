typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
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
typedef struct { s32 used; u8 b[0x58]; } ScriptRes;
ScriptRes *func_001BF274(unsigned int id);
s32 func_001BB528(ScriptCtx *ctx) {
    u8 *o = (u8 *)func_001BF274(ctx->pc[3]);
    o[0x10] |= ctx->pc[2];
    ctx->pc += 4;
    return 0;
}
