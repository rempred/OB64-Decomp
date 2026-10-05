typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef int s32;
typedef float f32;

typedef struct RuntimeUnit {
    u32 flags;
    u8 pad_04[4];
    f32 position[3];
    u8 pad_14[0x14];
    f32 points[3][3];
    u8 pad_4C[0x24];
    s32 field_70;
} RuntimeUnit;

typedef struct MaskView {
    u8 pad_00[8];
    u16 field_08, field_0A, field_0C, field_0E;
} MaskView;

typedef struct FieldView14 {
    u8 pad_00[0x14];
    f32 field_14, field_18, field_1C;
} FieldView14;

/* The original uses a list pointer followed by three float accumulators. */
typedef struct ListPointState {
    s32 *members;
    f32 point_x, point_y, point_z;
} ListPointState;

extern RuntimeUnit *D_801F0CB0[];
extern s32 D_801F3658, D_801F367C;
extern s32 D_801F0DE0, D_801F0DE8;
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
extern void func_000f6b10(void *, f32 *, f32 *, f32 *);
extern f32 func_000F3428(u8, f32, f32);
extern f32 func_000F315C(u8, f32, f32);
extern f32 hypotf(f32, f32);
extern void *resource_alloc(u32);
extern void resource_free(void *);
extern void func_00023940(char *, ...);

void func_00108C1C(f32 *x, f32 *z, s32 mode)
{
    f32 point[3];
    f32 adjusted_x, adjusted_z;
    f32 projected_x, projected_z;
    f32 output_x, output_z;
    f32 initial_x, initial_z;
    f32 sum_x, sum_z;
    s32 entry_state = D_801F0DE0;
    s32 state;
    s32 index, selected, count;
    s32 *members;
    s32 *write_cursor;
    RuntimeUnit **slot;
    ListPointState *list_state;

    if (((u32)entry_state - 7U) < 2) goto inactive_state;
    if (entry_state != 2) goto active_state;
inactive_state:
    if (entry_state == 2) return;
    if (D_801F0BAC != 0) D_801F0BAC++;
    return;

active_state:
    if ((D_801F0CA0->field_0C | D_801F0CA0->field_0E |
         D_801F0CA0->field_08 | D_801F0CA0->field_0A) & D_800E8108[0]) {
        mode = 1;
    }

    initial_x = *x;
    initial_z = *z;
    adjusted_x = initial_x;
    adjusted_z = initial_z;
    selected = func_00108500(&adjusted_x, &adjusted_z, 1);
    if (selected != -1) {
        u16 flags = D_801951CC[selected][0];

        if (!(flags & 8)) D_801F0BA8 = -1;
        else if (!(flags & 1)) D_801F0BA8 = -1;
        else D_801F0BA8 = selected;
    } else {
        D_801F0BA8 = selected;
    }

    list_state = &D_801F0BB0;
    if (list_state->members != 0) {
        resource_free(list_state->members);
        list_state->members = 0;
    }
    members = resource_alloc(0xCC);
    /* Retail reports allocation failure, then continues without an added guard. */
    if (members == 0) func_00023940(D_801EE0F0);
    count = 0;

    if (D_801F0DE0 == 1) {
        write_cursor = members;
        slot = &D_801F0CB0[30];
        for (index = 30; index < 50; index++, slot++) {
            RuntimeUnit *unit = *slot;
            s32 candidate;

            /* Both unused distance calls are present in the original. */
            hypotf(D_8018F58C->field_14 - D_801F0DC8,
                   D_8018F58C->field_1C - D_801F0DD0);
            hypotf(D_8018F58C->field_14 - unit->position[0],
                   D_8018F58C->field_1C - unit->position[2]);
            func_000f6b10(D_800E7A68[D_800E7AC0], unit->position,
                         &projected_x, &projected_z);
            candidate = hypotf(projected_x - adjusted_x,
                               projected_z - adjusted_z) <= 25.0f ? index : -1;
            if (candidate != -1) {
                if ((D_801F0CB0[candidate]->flags & 0x0839) == 0x31) {
                    *write_cursor++ = candidate;
                    count++;
                }
            }
        }
    } else {
        write_cursor = members;
        slot = D_801F0CB0;
        for (index = 0; index < D_801F367C; index++, slot++) {
            RuntimeUnit *unit = *slot;
            s32 candidate;

            hypotf(D_8018F58C->field_14 - D_801F0DC8,
                   D_8018F58C->field_1C - D_801F0DD0);
            hypotf(D_8018F58C->field_14 - unit->position[0],
                   D_8018F58C->field_1C - unit->position[2]);
            func_000f6b10(D_800E7A68[D_800E7AC0], unit->position,
                         &projected_x, &projected_z);
            candidate = hypotf(projected_x - adjusted_x,
                               projected_z - adjusted_z) <= 25.0f ? index : -1;
            if (candidate != -1) {
                if ((D_801F0CB0[candidate]->flags & 0x40001031) == 0x31) {
                    *write_cursor++ = candidate;
                    count++;
                }
            }
        }
    }

    members[count] = -1;
    list_state = &D_801F0BB0;
    list_state->members = members;
    state = D_801F0DE0;
    if ((u32)state >= 2) {
        if (D_801F0BAC != 0) {
            D_801F0BAC++;
            return;
        }
        if (state == 4) D_801F0BAC = 1;
        return;
    }

    sum_z = 0.0f;
    sum_x = sum_z;
    count = 0;
    list_state->point_z = 0.0f;
    list_state->point_y = 0.0f;
    list_state->point_x = 0.0f;
    if (D_801F3658 != -1) {
        selected = func_00108AA0(initial_x, initial_z, 1);
        if ((selected != -1) & (selected != 99)) {
            slot = &D_801F0CB0[D_801F3658];
            point[0] = (*slot)->points[selected][0];
            point[2] = (*slot)->points[selected][2];
            point[1] = (*slot)->points[selected][1];
            list_state->point_x += point[0];
            list_state->point_z += point[2];
            list_state->point_y += point[1];
            func_000f6b10(D_800E7A68[D_800E7AC0], point, &output_x, &output_z);
            sum_x += output_x - initial_x;
            sum_z += output_z - initial_z;
            count = 1;
        }
    }

    /* Preserve the global head test and the separate cursor's sentinel test. */
    if (list_state->members[0] != -1) {
        s32 *cursor = list_state->members;

        selected = *cursor++;
        if (selected != -1) {
            do {
                RuntimeUnit **bank = D_801F0CB0;
                u8 *selector = &D_800E7AC0;
                void **table = (void **)(selector - 0x58);

                if (D_801F3658 != -1) {
                    if (D_801F105E != 1) goto next_member;
                }
                slot = &bank[selected];
                point[0] = (*slot)->position[0];
                point[2] = (*slot)->position[2];
                if ((*slot)->field_70 == 1) {
                    point[1] = func_000F3428(D_800E7AB9, point[0], point[2]);
                } else {
                    point[1] = func_000F315C(D_800E7AB9, point[0], point[2]);
                }
                list_state->point_x += point[0];
                list_state->point_z += point[2];
                list_state->point_y += point[1];
                func_000f6b10(table[*selector], point, &output_x, &output_z);
                sum_x += output_x - initial_x;
                sum_z += output_z - initial_z;
                count++;
            next_member:
                selected = *cursor++;
            } while (selected != -1);
        }
    }

    selected = D_801F0BA8;
    if (selected != -1) {
        if (D_801F3658 != -1) {
            if (D_801F105E != 0) goto finish;
        }
        func_0012EA80(selected, point);
        list_state->point_x += point[0];
        list_state->point_y += point[1];
        list_state->point_z += point[2];
        func_000f6b10(D_800E7A68[D_800E7AC0], point, &output_x, &output_z);
        sum_x += output_x - initial_x;
        sum_z += output_z - initial_z;
        count++;
    }

finish:
    if (count != 0) {
        list_state->point_x /= (f32)count;
        list_state->point_y /= (f32)count;
        list_state->point_z /= (f32)count;
        if (mode == 0) {
            *x += (sum_x / (f32)count) / 4.0f;
            *z += (sum_z / (f32)count) / 4.0f;
        }
        D_801F0BAC++;
    } else {
        if (D_801F0BAC != 0) D_801F0BAC--;
    }
    /* This is an unsigned range test in the original, including negative states. */
    if ((u32)D_801F0DE8 >= 2) {
        if (D_801F0DE8 != 2) D_801F0BAC = 0;
    }
}
