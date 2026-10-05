/* Private common declaration study. Numeric fields and existing aliases only.
 * This is neither an admitted native group nor original-TU proof. */
#ifndef SCHEDULER_NINE_CONTEXT_H
#define SCHEDULER_NINE_CONTEXT_H
typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef int s32;
typedef float f32;
typedef double f64;
typedef struct RuntimeUnit {
    u32 flags;
    u8 source_index;
    u8 pad_05[3];
    f32 field_08, field_0C, field_10;
    u32 field_14;
    f32 field_18;
    u8 pad_1C[4];
    u8 field_20;
    u8 pad_21[7];
    f32 points[3][3];
    u8 pad_4C[0x24];
    s32 field_70, field_74;
    u32 field_78;
    s32 field_7C;
    u8 pad_80[0x28];
    s32 *field_A8;
} RuntimeUnit;
typedef RuntimeUnit UnitFlags;
typedef struct MaskView {
    u8 pad_00[8];
    u16 field_08, field_0A, field_0C, field_0E;
} MaskView;
typedef struct FieldView14 {
    u8 pad_00[0x14];
    f32 field_14, field_18, field_1C;
} FieldView14;
typedef struct ListPointState {
    s32 *members;
    f32 point_x, point_y, point_z;
} ListPointState;
typedef struct ResourceRecord {
    u8 pad_00[24];
    s32 field_18;
    u16 field_1C;
    u8 pad_1E[6];
} ResourceRecord;
typedef struct Bounds { f32 field_00, field_04, field_08, field_0C; } Bounds;
typedef struct Record10 { u8 bytes[10]; } Record10;
/* Existing +0 count, ten-byte records, +A2/+A4 words; no capacity claim. */
typedef struct RecordTable {
    u8 count;
    u8 records[16][10];
    u16 primary, secondary;
} RecordTable;
extern RuntimeUnit *D_801F0D28[];
extern s32 D_801F0DE0;
extern s32 D_801F0DE8;
extern RecordTable D_801F0E18;

extern s32 D_801F36C4, D_801F36C8, D_801F36CC;
extern s32 D_801F3658;
extern RuntimeUnit *D_801F0CB0[];
extern u8 D_800E7AC0;
extern void func_000f6b10(void *, f32 *, f32 *, f32 *);
extern f32 hypotf(f32, f32);
extern s32 D_801F3658, D_801F367C;
extern s32 D_801F0BA8, D_801F0BAC;
extern ListPointState D_801F0BB0;
extern MaskView *D_801F0CA0;
extern u16 *D_800E8108;
extern FieldView14 *D_8018F58C;
extern f32 D_801F0DC8, D_801F0DD0;
extern u8 D_801F105E;
extern u8 D_800E7AC0, D_800E7AB9;
extern void *D_800E7A68[];
extern u16 D_801951CC[][18];
extern char D_801EE0F0[];
extern s32 func_00108500(f32 *, f32 *, s32);
extern s32 func_00108AA0(f32, f32, s32);
extern void func_0012EA80(s32, f32 *);
extern f32 func_000F3428(u8, f32, f32);
extern f32 func_000F315C(u8, f32, f32);
extern void *resource_alloc(u32);
extern void resource_free(void *);
extern void func_00023940(char *, ...);
extern s32 D_801F367C;
extern s32 D_801F1070;
extern u8 D_801F0FDE;
extern u8 D_8018F481;
extern f32 D_801F3A38;
extern f32 D_801EB2F0[];
extern s32 func_0005c110(s32);
extern f32 func_00020bf0(f32);
extern f32 sinf(f32);
extern s32 func_801DD244(void);
extern void func_0010ADB8(s32);
extern u8 D_801969BA[][11];
extern s32 func_0012E968(RuntimeUnit *);
extern ResourceRecord D_801951B0[];
extern f64 D_801EE110;
extern Bounds D_801F0D98;
extern u8 D_801F0FE2;
extern u8 D_801F1004[], D_801F1014[], D_801F1024[];
extern u8 D_80196A38[];
extern void func_00118644(u8, s32);
extern s32 func_0012DA9C(RuntimeUnit *);
extern s32 func_0012DA10(RuntimeUnit *);
extern s32 func_0004813c(s32);
extern s32 func_801DD2B0(RuntimeUnit *);
extern u8 *D_801F361C;
extern void *memcpy(void *, void *, u32);
extern void func_00109C3C(RuntimeUnit *);
extern void func_0013A558(s32, s32, u8 *, u8 *);
extern void func_0013AA40(s32, s32, u8 *, u8 *);
extern void func_0013B350(s32, s32, u8 *, u8 *);
extern Record10 D_801F0E19[];
extern u16 D_801F0EBC;
extern u8 D_801E8680;
extern s32 func_0010A128(RuntimeUnit *unit);
extern void func_0010A718(RuntimeUnit *unit);
#endif

void func_0010ADB8(s32 available)
{
    u8 index = D_801E8680;

    while (index < D_801E8680 + 3) {
        if (index >= 50) break;
        func_0010A128(D_801F0CB0[index]);
        if (D_801F0E18.count != 0) {
            func_0010A718(D_801F0CB0[index]);
        }
        index++;
    }

    D_801E8680 += 3;
    if (D_801E8680 > 50) {
        D_801E8680 = 0;
        if (D_801F0E18.count != 0) {
            for (index = 0; index < D_801F0E18.count; index++) {
                u8 *record = D_801F0E18.records[index];
                /* Retail derives the mask from an unchecked loaded ID.
                 * This expression follows its C shift form; ID zero or an
                 * excessive shift has no defined C behavior. Static layout
                 * and a byte match do not establish the resource domain. */
                u16 mask = 1U << (record[0] - 1);

                if (record[1] == 9) D_801F0E18.primary &= ~mask;
                if (record[1] == 14) D_801F0E18.primary &= ~mask;
                if (record[1] == 12) D_801F0E18.primary &= ~mask;
                if (record[1] == 5) D_801F0E18.primary &= ~mask;

                if ((D_801F0E18.primary & mask) == 0) {
                    switch (record[1]) {
                    case 2:
                    case 3:
                        if ((D_801F0E18.secondary & mask) == 0) {
                            D_801F0E18.primary |= mask;
                        }
                        break;
                    case 9:
                        if (available != 0) {
                            if (record[6] >= available) {
                                D_801F0E18.primary |= mask;
                            }
                        }
                        break;
                    case 14:
                        /* Keep this positive gate and its own mask test.
                         * The pinned compiler gives the saved mask its
                         * retail allocation before merging the common tail. */
                        if ((available != 0) & (available < 7)) {
                            if (D_801F0E18.secondary & mask) {
                                D_801F0E18.primary |= mask;
                            }
                        }
                        break;
                    case 1:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 10:
                    case 12:
                    case 13:
                    case 19:
                        if (D_801F0E18.secondary & mask) {
                            D_801F0E18.primary |= mask;
                        }
                        break;
                    case 11:
                    case 15:
                    case 16:
                    case 17:
                    case 18:
                    default:
                        break;
                    }
                    if (record[1] != 14) D_801F0E18.secondary &= ~mask;
                    if (record[1] == 5) D_801F0E18.secondary &= ~mask;
                }
            }
        }
    }
}
