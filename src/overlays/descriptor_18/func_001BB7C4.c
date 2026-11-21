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
extern u16 D_8022A254;
extern u16 D_8022A828;
s32 func_001BB7C4(ScriptCtx *ctx)
{
  u16 a = D_8022A828 | (*((u16 *) (ctx->pc + 2)));
  ScriptCtx *new_var;
  D_8022A254 |= 2;
  new_var = ctx;
  new_var->pc += 4;
  D_8022A828 = a;
  return 0;
}
