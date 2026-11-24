typedef unsigned char u8;
typedef signed int s32;
typedef struct {
    u8 b[0x34];
} EChar282;
typedef struct {
    u8 b[0x38];
} PChar282;
extern EChar282 D_80195560_copy[];
extern PChar282 D_80193BC0_copy[];
extern char *D_8018EA00[];
/* Find a persistent character by primary class ID, with the fixed name table as fallback. */
void *func_00283808(s32 primary_class_id) {
    s32 character_index;
    for (character_index = 0; character_index < 100; character_index++) {
        if (D_80195560_copy[character_index].b[0x11] == primary_class_id) {
            return &D_80195560_copy[character_index];
        }
    }
    for (character_index = 0; character_index < 100; character_index++) {
        if (D_80193BC0_copy[character_index].b[0x11] == primary_class_id) {
            return &D_80193BC0_copy[character_index];
        }
    }
    if (primary_class_id >= 0x54) {
        return D_8018EA00[primary_class_id];
    }
    return ((void *)0);
}
