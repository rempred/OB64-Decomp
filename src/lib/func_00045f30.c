typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
extern u8 D_80195560[][0x34];
extern u16 D_801953F4[];
extern u8 D_801971F0[][0x19];
extern u8 D_801969B8[][0xB];
/* Clear transient character rows, special-slot values and related deployment entries. */
void func_00045f30(void) {
    s16 index;
    for (index = 1; index < 99; index++) {
        bzero(D_80195560[index], 0x34);
    }
    for (index = 0; index < 120; index++) {
        D_801953F4[index] = 0;
    }
    for (index = 30; index < 50; index++) {
        bzero(D_801971F0[index], 0x19);
    }
    for (index = 0; index < 10; index++) {
        if (D_801969B8[index][1] & 0x80) {
            bzero(D_801969B8[index], 0xB);
        }
    }
}
