typedef unsigned char u8;
typedef unsigned short u16;
typedef signed short s16;
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
void func_001C2714(s16 *list);
s32 func_001BBF58(ScriptCtx *ctx) {
    func_001C2714(*(s16 **)(ctx->pc + 4));
    ctx->pc += 8;
    return 0;
}
