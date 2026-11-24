typedef struct {
    int words[20];
} Func0020F3D4Block;

extern unsigned char *D_801CE8BC;
extern void func_001F114C(void *actor);

void func_0020F3D4(void)
{
    int roster_byte_offset;
    unsigned int actor_index;
    unsigned int clearIndex;
    unsigned char *actor;
    unsigned char *scene_bytes;
    unsigned char *clear_primary_child;
    unsigned char *child;
    unsigned char *secondary_child;
    unsigned char **primary_slot;
    unsigned char **clear_primary_slot;
    unsigned int value;
    int count;

    actor_index = 0;
    roster_byte_offset = 0;
    do {
        actor = 0;
        if (actor_index < 20U) {
            value = (unsigned int)D_801CE8BC;
            if (*(int *)((unsigned char *)value + roster_byte_offset + 0x20C) != 0) {
                actor = (unsigned char *)value + (roster_byte_offset + 0x1C4);
            }
        }
        if (actor != 0) {
            func_001F114C(actor);
            primary_slot = (unsigned char **)actor;
            do {
                child = *primary_slot;
                if (child != 0) {
                    secondary_child = primary_slot[3];
                    if (secondary_child != 0) {
                        *(Func0020F3D4Block *)(secondary_child + 0x44) =
                            *(Func0020F3D4Block *)(child + 0x44);
                    }
                    child = *primary_slot;
                    if (child != 0) {
                        value = child[0x36];
                        if (value < child[0x37]) {
                            child[0x36] = value + 1;
                        }
                    }
                }
                primary_slot++;
            } while (primary_slot < (unsigned char **)(actor + 0xC));

            child = ((unsigned char **)actor)[6];
            if (child != 0) {
                value = child[0x36];
                if (value < child[0x37]) {
                    child[0x36] = value + 1;
                }
            }
            child = ((unsigned char **)actor)[7];
            if (child != 0) {
                value = child[0x36];
                if (value < child[0x37]) {
                    child[0x36] = value + 1;
                }
            }

            count = *(int *)(actor + 0xA0);
            if (count != 0) {
                count--;
                *(int *)(actor + 0xA0) = count;
                if (count == 0) {
                    clearIndex = 0;
                    clear_primary_slot = (unsigned char **)actor;
                    do {
                        clear_primary_child = *clear_primary_slot;
                        clearIndex++;
                        if (clear_primary_child != 0) {
                            *(short *)(clear_primary_child + 0x32) = 0;
                            *(short *)(clear_primary_child + 0x30) = 0;
                            *(short *)(clear_primary_child + 0x2E) = 0;
                        }
                        clear_primary_slot++;
                    } while (clearIndex < 3U);
                }
            }

            child = ((unsigned char **)actor)[6];
            if (child != 0 && *(short *)(child + 0x48) == 0) {
                *(int *)(child + 0x18) = 0;
                ((unsigned char **)actor)[6] = 0;
            }
            child = ((unsigned char **)actor)[7];
            if (child != 0 && *(short *)(child + 0x48) == 0) {
                *(int *)(child + 0x18) = 0;
                ((unsigned char **)actor)[7] = 0;
            }
        }
        actor_index++;
        roster_byte_offset += 0xF8;
    } while ((int)actor_index < 20);

    scene_bytes = D_801CE8BC;
    (*(int *)(scene_bytes + 0x6080))++;
}
