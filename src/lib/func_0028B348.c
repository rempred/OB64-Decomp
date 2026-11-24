#include "game/framebuffer_list.h"
typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
void *D_8009DBB8(void *dst, u32 handle);
void *D_8009DD38(u32 handle);
void *func_000016C4(void *ptr);
extern void *D_800A8204[3];
extern void *D_800C4BB8;
extern u8 D_800E7A0C;
void func_00019e10(void);
void D_8016CD5C(s32 a);
extern u8 *D_8023DE30;
typedef struct {
    void *unk00;
    u8 *pixels;
    u8 *tex;
    void *chunk0C;
    void *sprite;
    void *chunk14;
} Res28;
extern Res28 *D_8023DE34;
extern inline void func_0028b088(void) {
    func_00019e10();
    func_00019eb0(D_800A8204, 3);
    D_800C4BB8 = D_800A8204[0];
    func_00019e10();
    D_8016CD5C(0);
    D_800E7A0C = 1;
}
void func_0001a050(void);
void func_0028B348(void) {
    void **t;
    s32 i;
    u8 *raw;
    func_0028b088();
    func_0001a050();
    for (i = 0; i < 50; i++) {
        if (((void **)D_8023DE30)[i] != ((void *)0)) {
            func_000016C4((*(void * *)((u8 *)(((void **)D_8023DE30)[i]) + (0x30))));
            func_000016C4(((void **)D_8023DE30)[i]);
        }
    }
    for (i = 0; i < 10; i++) {
        func_000016C4((*(void * *)((u8 *)(D_8023DE30 + i * 4) + (0x208))));
    }
    for (i = 0; i < 10; i++) {
        if ((*(void * *)((u8 *)(D_8023DE30 + i * 4) + (0x168))) != ((void *)0)) {
            func_000016C4((*(void * *)((u8 *)(D_8023DE30 + i * 4) + (0x168))));
        }
    }
    for (i = 0; i < 40; i++) {
        if ((*(void * *)((u8 *)(D_8023DE30 + i * 4) + (0xC8))) != ((void *)0)) {
            func_000016C4((*(void * *)((u8 *)(D_8023DE30 + i * 4) + (0xC8))));
        }
    }
    for (i = 0; i < 10; i++) {
        if ((*(void * *)((u8 *)(D_8023DE30 + i * 4) + (0x190))) != ((void *)0)) {
            func_000016C4((*(void * *)((u8 *)(D_8023DE30 + i * 4) + (0x190))));
        }
    }
    func_000016C4(D_8023DE30);
    D_8023DE30 = ((void *)0);
    raw = D_8009DBB8(((void *)0), 0x1890C90);
    D_8023DE34->chunk14 = D_8009DD38(*(u32 *)(raw + 0x4C));
    func_000016C4(raw);
}
