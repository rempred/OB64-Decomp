typedef signed short s16;

extern char *D_8022A974;

void func_0029E218(void *actor);
void func_0029E7E0(void *sprite);

void func_002A0804(void)
{
    s16 index;

    if (*(unsigned char *)(D_8022A974 + 0x1CB1) != 0) {
        return;
    }

    for (index = 0; index < 28; index++) {
        void *actor = *(void **)(D_8022A974 + index * 4 + 0x18);

        if (actor != 0) {
            func_0029E218(actor);
        }
    }

    for (index = 0; index < 30; index++) {
        void *sprite = *(void **)(D_8022A974 + index * 4 + 0x1AC0);

        if (sprite != 0) {
            func_0029E7E0(sprite);
        }
    }
}
