typedef unsigned short u16;
extern u16 D_8019C91A;
void func_0006b488(void);
void D_80229828(void);
void D_80229A20(void);
void D_802263CC(void);
void D_802282D0(void);
void D_80221030(void);
void func_0006ca74(void) {
    if (D_8019C91A != 0) {
        D_8019C91A--;
    }
    if (D_8019C91A == 0) {
        func_0006b488();
    }
    D_80229828();
    D_80229A20();
    D_802263CC();
    D_802282D0();
    D_80221030();
}
