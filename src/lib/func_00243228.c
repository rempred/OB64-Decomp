typedef unsigned char u8;
typedef struct {
    u8 unk00[0x7E];
    u8 step;
} Seq20F;
extern Seq20F *D_801F0550;
void func_00243228(void) {
    if (D_801F0550->step == 1) {
        D_801F0550->step++;
    }
    if (D_801F0550->step == 4) {
        D_801F0550->step++;
    }
}
