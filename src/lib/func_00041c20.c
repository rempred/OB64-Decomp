#include "game/record_name_selection.h"

typedef unsigned char u8;
typedef unsigned int u32;
typedef signed int s32;

typedef struct { u8 bytes[52]; } Record52;
typedef struct { u8 bytes[56]; } Record56;
typedef struct { u32 key[3]; } ResourceKeys;

extern Record52 g_func_0019554C_records_52[];
extern Record56 g_func_0019554C_records_56[];
extern ResourceKeys D_8018FEAC;
extern char *D_8018EA00[];

extern void *func_0002E138(u32 key);
extern s32 rand(void);
extern void func_80093380(void *destination, s32 size);
extern unsigned char *func_0002C950(unsigned char *destination, const unsigned char *source);
extern s32 func_0002C9E0(const char *first, const char *second);
extern void *resource_free(void *resource);

/* Assign a character name and check randomly chosen names for collisions. */
void func_00041c20(s32 table_mode, u8 record_index)
{
    u8 *character_bytes;
    s32 primary_class_id;
    s32 attempts_left;
    u32 table_selector;
    u32 keys[3];

    if ((u8)table_mode == 0) {
        character_bytes = g_func_0019554C_records_56[record_index].bytes;
    } else {
        character_bytes = g_func_0019554C_records_52[record_index].bytes;
    }

    primary_class_id = character_bytes[0x11];
    if (((u8)primary_class_id < 0x51) || ((u32)(primary_class_id - 0x72) < 3)) {
      attempts_left = 0x20;
      /* Keep the byte mode as a word outside the retry loop. KMC otherwise
       * leaves the mode-one constant inside the conditional second scan. */
      table_selector = (u8)table_mode;
      do {
        u8 *name_table;
        u8 *chosen_name;
        s32 names_to_skip;
        s32 duplicate_name;
        s32 other_index;
        u32 *name_resource_key;

        name_resource_key = &keys[character_bytes[0x14]];
        *(ResourceKeys *)keys = D_8018FEAC;
        name_table = func_0002E138(*name_resource_key);
        names_to_skip = rand() % 256;
        chosen_name = name_table;
        while (names_to_skip != 0) {
            while (*chosen_name++ != 0) {
            }
            names_to_skip--;
        }

        func_80093380(character_bytes, 0x11);
        func_0002C950(character_bytes, chosen_name);
        resource_free(name_table);
        attempts_left--;

        duplicate_name = 0;
        for (other_index = 1; other_index < 100; other_index++) {
            if ((table_selector == 0) && (record_index != other_index) &&
                (g_func_0019554C_records_56[other_index].bytes[0x11] != 0) &&
                (func_0002C9E0((const char *)character_bytes,
                                 (const char *)g_func_0019554C_records_56[other_index].bytes) == 0)) {
                duplicate_name++;
                break;
            }
        }
        if (duplicate_name == 0) {
            for (other_index = 1; other_index < 100; other_index++) {
                if ((table_selector == 1) && (record_index != other_index) &&
                    (g_func_0019554C_records_52[other_index].bytes[0x11] != 0) &&
                    (func_0002C9E0((const char *)character_bytes,
                                     (const char *)g_func_0019554C_records_52[other_index].bytes) == 0)) {
                    duplicate_name++;
                    break;
                }
            }
        }
        attempts_left &= -(duplicate_name != 0);
      } while (attempts_left != 0);
    } else {
        func_0002C950(character_bytes, (const u8 *)D_8018EA00[(u8)primary_class_id]);
    }
}
