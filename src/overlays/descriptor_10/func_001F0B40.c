typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
void *func_000016C4(void *ptr);
typedef struct {
    u8 unk0000[0x1C0];
    s32 strategy;
    u8 unk01C4[0x5020];
    s32 listB[0x36];
    s32 nB;
    s32 listA[0x100];
    s32 nA;
} Ctx1F;
typedef struct {
    void *data;
    s32 ttl;
    s32 id;
} Slot1F;
extern Ctx1F *D_801CE8BC;
void func_001F0B40(void) {
    Slot1F *s;
    u32 i;
    for (i = 0; i < 16; i++) {
        if ((s = (Slot1F *)D_801CE8BC + i)->id != 0) {
            if (--s->ttl == 0) {
                func_000016C4(s->data);
                {
                    Slot1F *t = (Slot1F *)D_801CE8BC + i;
                    t->data = ((void *)0);
                    t->id = 0;
                }
            }
        }
    }
    for (i = 0; i < 16; i++) {
        if ((s = (Slot1F *)D_801CE8BC + i + 16)->data != ((void *)0)) {
            if (--s->id == 0) {
                func_000016C4(s->data);
                {
                    Slot1F *t = (Slot1F *)D_801CE8BC + i + 16;
                    t->data = ((void *)0);
                    t->ttl = 0;
                }
            }
        }
    }
}
