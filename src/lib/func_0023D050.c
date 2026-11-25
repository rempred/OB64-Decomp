typedef unsigned char u8;
extern u8 *D_801F0564;
extern u8 *D_801F0568;
void func_0023B588(void *fn);
void func_0023C114(void);
void func_0023D050(u8 *p) {
    D_801F0564 = p;
    D_801F0568 = p + 0xF8;
    func_0023B588(func_0023C114);
}
