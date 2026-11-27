struct Task23;
typedef unsigned char u8;
extern u8 *D_801F0564;
extern u8 *D_801F0568;
struct Task23 *func_0023B588(void (*)(int, struct Task23 *));
void func_0023C114(int, struct Task23 *);
struct Task23 *func_0023D050(u8 *p) {
    D_801F0564 = p;
    D_801F0568 = p + 0xF8;
    return func_0023B588(func_0023C114);
}
