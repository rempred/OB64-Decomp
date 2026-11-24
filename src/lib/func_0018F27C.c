typedef unsigned char u8;
typedef signed int s32;
extern void *D_8021B170;
extern u8 D_8021B299[];
extern void *D_8021B174;
extern s32 D_8021B2AC;
extern s32 D_8021B2A4;
extern u8 D_80210219;
extern void *D_8021B174;
extern s32 D_8021B2AC;
extern s32 D_8021B2A4;
extern u8 D_80210219;
extern s32 D_8021B2B4;
typedef struct {
    u8 unk0;
    u8 flags;
    u8 members[5];
    u8 pos[5];
    u8 rest[0xD];
} Squad18F;
typedef struct {
    u8 unk00[0x11];
    u8 b11;
    u8 b12;
    u8 rest[0x25];
} Unit18F;
extern Squad18F g_func_001957D0_source_records[];
extern Unit18F D_80193BC0_copy[];
extern s32 D_801F3658;
extern s32 D_801ED5B0;
extern u8 D_8021B290[];
extern s32 D_8021B2A8;
extern s32 D_8021B2B0;
extern s32 D_8021B2B8;
unsigned char D_8016DE1C(int, int);
void bzero(void *p, s32 n);
void func_0018F27C(void) {
    s32 i;
    s32 m;
    u8 p;
    bzero(D_8021B290, 9);
    bzero(D_8021B299, 9);
    for (i = 0; i < 5; i++) {
        m = g_func_001957D0_source_records[D_801F3658].members[i];
        if (m != 0) {
            p = g_func_001957D0_source_records[D_801F3658].pos[i];
            D_8021B290[p] = m;
            if (m >= 100) {
                D_8021B299[p] = 1;
            } else {
                D_8021B299[p] = (unsigned char)D_8016DE1C((unsigned char)(D_80193BC0_copy[m].b11),(unsigned char)(D_80193BC0_copy[m].b12));
            }
        }
    }
    D_801ED5B0 = g_func_001957D0_source_records[D_801F3658].pos[0];
    D_8021B2A8 = -1;
    D_8021B2AC = -1;
    D_8021B2B4 = -1;
    D_8021B2B0 = -1;
    D_8021B170 = ((void *)0);
    D_8021B174 = ((void *)0);
    D_8021B2A4 = 0;
    D_8021B2B8 = 0;
    D_80210219 = (D_80210219 & 0xF) | 0x20;
}
