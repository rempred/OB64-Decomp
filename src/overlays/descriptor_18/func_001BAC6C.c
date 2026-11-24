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
extern u8 *D_8022A234;
extern u8 D_801936E0;
extern s32 D_8022A230;
extern s32 D_8022A238;
extern s32 D_8022A23C;
extern s32 D_8022A240;
extern s32 (*D_80229D34[])(ScriptCtx *c);
void func_001BDC6C(void);
void func_001C13E0(void);
void func_001C1DF4(void);
void func_001C2938(void);
void func_001BAC6C(void) {
    s32 i;
    if (D_801936E0 != 0) {
        D_8022A828 = 0;
        D_8022A254 &= 0x7FFF;
        for (i = 0; i < D_8022A230; i++) {
            ScriptCtx *c = (ScriptCtx *)(D_8022A234 + i * 0x38);
            if (c->unk00 == 0) {
                continue;
            }
            for (;;) {
                s32 (**tbl)(ScriptCtx *);
                u8 t = *c->pc;
                u8 op;
                if (t & 0x80) {
                    if (D_8022A23C == 0) {
                        for (;;) {
                        }
                    }
                    if (*c->pc >= D_8022A238) {
                        for (;;) {
                        }
                    }
                    tbl = (s32 (**)(ScriptCtx *))D_8022A23C;
                    op = *c->pc & 0x7F;
                } else {
                    tbl = D_80229D34;
                    op = t;
                }
                if (tbl[op](c) != 0) {
                    break;
                }
            }
        }
        if (D_8022A240 != 0) {
            ((void (*)(void))D_8022A240)();
        }
        func_001BDC6C();
        func_001C13E0();
        func_001C1DF4();
        func_001C2938();
    }
}
