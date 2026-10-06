typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;

/* Partial views derived from this owner's actual memory accesses. */
typedef struct InputView {
    u8 unknown00[8];
    u8 *buffer;
    int limit;
    int position;
} InputView;

extern u8 *D_800AF390;
extern const u8 D_800AE0E8[];
extern const u8 D_800AE108[];
extern void func_80093380(void *, u32);
extern u32 func_0000F970(void *, u32, u32, InputView *);
extern void func_00023460(const void *, void *, u32);
extern void func_0000BFC0(const u8 *);
extern void func_0000C938(u8 *, int);
extern void func_0000F408(u8 *, const u8 *);
extern void func_0000F450(u8 *, const u8 *);
extern void func_0000BF48(u8 *, int);

u16 func_0000BB10(void);
u32 func_0000BB44(void);
void func_0000BBA8(u8 *, int);
void func_0000BC3C(u8 *, int);

#define INPUT_BYTE(input) ((input)->buffer[(input)->position++])
#define RECORD_WORD(record, offset) (*(u32 *)((record) + (offset)))
#define RECORD_HALF(record, offset) (*(u16 *)((record) + (offset)))

int boot_resource_tag_record_decode(InputView *input, u8 *record)
{
    u8 raw[0x1000];
    u8 prefix[0x400];
    int prefix_length = 0;
    int tag;
    int name_length;
    int extension_length;
    int count;
    u8 *extension_start;
    u8 *prefix_base;

    func_80093380(record, 0x12C);
    tag = input->position < input->limit ? INPUT_BYTE(input) : -1;
    if (tag == -1) {
        return 0;
    }
    if (tag == 0) {
        return 0;
    }
    if (tag & 0x80) {
        u32 value;
        record[0] = tag;
        value = INPUT_BYTE(input);
        value |= (u32)INPUT_BYTE(input) << 8;
        value |= (u32)INPUT_BYTE(input) << 16;
        value |= (u32)INPUT_BYTE(input) << 24;
        RECORD_WORD(record, 0x08) = value;
        value = INPUT_BYTE(input);
        value |= (u32)INPUT_BYTE(input) << 8;
        value |= (u32)INPUT_BYTE(input) << 16;
        value |= (u32)INPUT_BYTE(input) << 24;
        RECORD_WORD(record, 0x0C) = value;
        return 1;
    }

    if (func_0000F970(raw + 1, 1, tag - 1, input) < (u32)(tag - 1)) {
        func_0000BFC0(D_800AE0E8);
        return 0;
    }
    D_800AF390 = raw + 0x15;
    record[0x15] = raw[0x14];
    if (record[0x15] != 2) {
        if (func_0000F970(raw + tag, 1, 2, input) < 2) {
            func_0000BFC0(D_800AE0E8);
            return 0;
        }
    }
    D_800AF390 = raw + 2;
    record[0] = tag;
    func_00023460(raw + 2, record + 1, 5);
    D_800AF390 = raw + 7;
    RECORD_WORD(record, 0x08) = func_0000BB44();
    RECORD_WORD(record, 0x0C) = func_0000BB44();
    RECORD_WORD(record, 0x10) = func_0000BB44();
    record[0x14] = *D_800AF390++;
    record[0x15] = *D_800AF390++;
    name_length = 0;
    if (record[0x15] != 2) {
        name_length = *D_800AF390++;
        for (count = 0; count < name_length; count++) {
            record[0x16 + count] = *D_800AF390++;
        }
        record[0x16 + name_length] = 0;
    } else {
        RECORD_WORD(record, 0x120) = RECORD_WORD(record, 0x10);
    }
    RECORD_HALF(record, 0x124) = 0x81B6;
    extension_length = tag - name_length;
    RECORD_HALF(record, 0x128) = 0;
    RECORD_HALF(record, 0x126) = 0;
    if (extension_length >= 24) {
        RECORD_HALF(record, 0x116) = func_0000BB10();
        record[0x11C] = *D_800AF390++;
        RECORD_WORD(record, 0x118) = 1;
    } else if (extension_length == 22) {
        RECORD_HALF(record, 0x116) = func_0000BB10();
        record[0x11C] = 0;
        RECORD_WORD(record, 0x118) = 1;
    } else if (extension_length == 20) {
        record[0x11C] = 0;
        RECORD_WORD(record, 0x118) = 0;
    } else {
        return 0;
    }

    if (record[0x11C] == 'U' && record[0x15] == 0) {
        record[0x11D] = *D_800AF390++;
        RECORD_WORD(record, 0x120) = func_0000BB44();
        RECORD_HALF(record, 0x124) = func_0000BB10();
        RECORD_HALF(record, 0x126) = func_0000BB10();
        RECORD_HALF(record, 0x128) = func_0000BB10();
        return 1;
    }
    if (record[0x15] != 0) {
        if (record[0x15] != 2) {
            D_800AF390 = raw + record[0];
        }
        extension_start = D_800AF390;
        prefix_base = prefix;
        for (;;) {
            tag = func_0000BB10();
            if (tag == 0) {
                break;
            }
            if (record[0x15] != 2) {
                if ((int)(prefix - D_800AF390) < tag ||
                    func_0000F970(D_800AF390, 1, tag, input) < (u32)tag) {
                    func_0000BFC0(D_800AE108);
                    return 0;
                }
            }
            switch (*D_800AF390++) {
            case 1:
                for (count = 0; count < tag - 3; count++) {
                    record[0x16 + count] = *D_800AF390++;
                }
                record[0x13 + tag] = 0;
                break;
            case 2:
                {
                    u8 *destination = prefix_base;
                    for (count = 0; count < tag - 3; count++) {
                        *destination++ = *D_800AF390++;
                    }
                    prefix[tag - 3] = 0;
                }
                func_0000C938(prefix, '/');
                prefix_length = tag - 3;
                break;
            case 64:
                if ((record[0x11C] == 'M') | (record[0x11C] == 'H') || record[0x11C] == 0) {
                    record[0x14] = func_0000BB10();
                }
                break;
            case 80:
                if (record[0x11C] == 'U') {
                    RECORD_HALF(record, 0x124) = func_0000BB10();
                }
                break;
            case 81:
                if (record[0x11C] == 'U') {
                    RECORD_HALF(record, 0x128) = func_0000BB10();
                    RECORD_HALF(record, 0x126) = func_0000BB10();
                }
                break;
            case 84:
                if (record[0x11C] == 'U') {
                    RECORD_WORD(record, 0x120) = func_0000BB44();
                }
                break;
            /* These are the original table's 79 shared-handler entries. */
            case 0:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
            case 21:
            case 22:
            case 23:
            case 24:
            case 25:
            case 26:
            case 27:
            case 28:
            case 29:
            case 30:
            case 31:
            case 32:
            case 33:
            case 34:
            case 35:
            case 36:
            case 37:
            case 38:
            case 39:
            case 40:
            case 41:
            case 42:
            case 43:
            case 44:
            case 45:
            case 46:
            case 47:
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case 58:
            case 59:
            case 60:
            case 61:
            case 62:
            case 63:
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 82:
            case 83:
            default:
                D_800AF390 += tag - 3;
                break;
            }
        }
        if (record[0x15] != 2) {
            int consumed = D_800AF390 - extension_start;
            if (consumed != 2) {
                RECORD_WORD(record, 0x08) = RECORD_WORD(record, 0x08) + 2 - consumed;
                record[0] += consumed - 2;
            }
        }
    }
    if (prefix_length != 0) {
        func_0000F408(prefix, record + 0x16);
        func_0000F450(record + 0x16, prefix);
        name_length += prefix_length;
    }
    switch (record[0x11C]) {
    case 'M':
        func_0000BC3C(record + 0x16, name_length);
    case 'H':
        if (record[0x15] == 2) {
            RECORD_WORD(record, 0x120) = RECORD_WORD(record, 0x10);
        } else {
            RECORD_WORD(record, 0x120) = 0;
        }
        break;
    case 'U':
        break;
    case 'm':
        func_0000BF48(record + 0x16, name_length);
        RECORD_WORD(record, 0x120) = 0;
        break;
    default:
        func_0000BBA8(record + 0x16, name_length);
        if (record[0x15] == 2) {
            RECORD_WORD(record, 0x120) = RECORD_WORD(record, 0x10);
        } else {
            RECORD_WORD(record, 0x120) = 0;
        }
        break;
    }
    return 1;
}

u16 func_0000BB10(void)
{
    u32 first = *D_800AF390++;
    u32 second = *D_800AF390++;
    return (second << 8) | first;
}

u32 func_0000BB44(void)
{
    u32 byte0 = *D_800AF390++;
    u32 byte1 = *D_800AF390++;
    u32 byte2 = *D_800AF390++;
    u32 byte3 = *D_800AF390++;
    return ((byte3 << 24) + (byte2 << 16) + (byte1 << 8)) | byte0;
}

void func_0000BBA8(u8 *path, int length)
{
    u32 have_characters = length > 0;
    union { int scan_end; int slash; } phase;
    int contains_lowercase = 0;
    if (have_characters == 1) {
        u8 *scan = path;
        phase.scan_end = length + (int)path;
scan_character:
        if ((u32)(*scan - 'a') < 26) {
            contains_lowercase = 1;
            goto normalize_path;
        }
        scan++;
        if ((int)scan < phase.scan_end) {
            goto scan_character;
        }
    }
normalize_path:
    if (length > 0) {
        int backslash = '\\';
        phase.slash = '/';
        length += (int)path;
        do {
            int character = *path;
            if (character == backslash) {
                *path = phase.slash;
            } else if (!contains_lowercase && (u32)(character - 'A') < 26) {
                *path = character + 32;
            }
            path++;
        } while ((int)path < length);
    }
}

void func_0000BC3C(u8 *path, int length)
{
    if (length > 0) {
        int backslash = '\\';
        int slash = '/';
        length += (int)path;
        do {
            int character = *path;
            if (character == backslash) {
                *path = slash;
            } else if ((u32)(character - 'A') < 26) {
                *path = character + 32;
            }
            path++;
        } while ((int)path < length);
    }
}
