typedef unsigned char u8;
extern u8 *D_8019E194;
void func_000E6B14(void);
void func_000E6650(void);
void func_000E659C(void) {
    D_8019E194[0x40] = 0;
    func_000E6B14();
    if (D_8019E194[0x4F] == 0) {
        func_000E6650();
    }
}
void func_000E6B14(void);
