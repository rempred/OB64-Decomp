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

extern u8 *func_0002E138(u32 key);
extern s32 rand(void);
extern void func_80093380(void *destination, s32 size);
extern char *func_0002C950(char *destination, const char *source);
extern s32 func_0002C9E0(const char *first, const char *second);
extern void resource_free(void *resource);

void func_00041c20(u8 mode, u8 record_index)
{
    u8 *record;
    u8 code;
    s32 attempts;
    ResourceKeys keys;

    if (mode == 0) {
        record = g_func_0019554C_records_56[record_index].bytes;
    } else {
        record = g_func_0019554C_records_52[record_index].bytes;
    }

    code = record[0x11];
    if ((code >= 0x51) && ((u32)(code - 0x72) >= 3)) {
        func_0002C950((char *)record, D_8018EA00[code]);
        return;
    }

    attempts = 0x20;
    do {
        u8 *decoded;
        u8 *chosen;
        s32 skip;
        s32 duplicate;
        s32 candidate;

        keys = D_8018FEAC;
        decoded = func_0002E138(keys.key[record[0x14]]);
        skip = rand() % 256;
        chosen = decoded;
        while (skip != 0) {
            while (*chosen++ != 0) {
            }
            skip--;
        }

        func_80093380(record, 0x11);
        func_0002C950((char *)record, (const char *)chosen);
        resource_free(decoded);

        duplicate = 0;
        for (candidate = 1; candidate < 100; candidate++) {
            if ((mode == 0) && (record_index != candidate) &&
                (g_func_0019554C_records_56[candidate].bytes[0x11] != 0) &&
                (func_0002C9E0((const char *)record,
                                 (const char *)g_func_0019554C_records_56[candidate].bytes) == 0)) {
                duplicate = 1;
                break;
            }
        }
        if (duplicate == 0) {
            for (candidate = 1; candidate < 100; candidate++) {
                if ((mode == 1) && (record_index != candidate) &&
                    (g_func_0019554C_records_52[candidate].bytes[0x11] != 0) &&
                    (func_0002C9E0((const char *)record,
                                     (const char *)g_func_0019554C_records_52[candidate].bytes) == 0)) {
                    duplicate = 1;
                    break;
                }
            }
        }
        attempts = (attempts - 1) & -duplicate;
    } while (attempts != 0);
}
