typedef unsigned char u8;
typedef int s32;
extern s32 func_0005c110(s32);

/* Research reconstruction of the complete accepted owner. The numeric
 * inputs, flag IDs, and two output bytes intentionally have no terrain names.
 * Ordered flag queries and default paths are retained; no table owner is
 * activated by this source. Static mapping is separate from matching proof.
 */
void func_0013A558(s32 input0, s32 input1, u8 *first, u8 *second) {
    u8 result0 = 0;
    u8 result1 = 0;
    s32 query;

    if ((((u8)input0 == 0) | ((u8)input0 == 16)) != 0) {
        input0 = 9;
    }
    switch ((u8)input0) {
    case 1:
        goto inputs_0;
    case 2:
    case 10:
        goto inputs_1;
    case 3:
        goto inputs_2;
    case 4:
        goto inputs_3;
    case 5:
    case 11:
        goto inputs_4;
    case 6:
        goto inputs_5;
    case 7:
    case 12:
        goto inputs_6;
    case 8:
        goto inputs_7;
    case 9:
        goto inputs_8;
    default:
        goto both_zero;
    }

inputs_0:
    switch ((u8)input1) {
    case 1:
    case 2:
        goto both_one;
    case 3:
        goto flag1_both;
    case 4:
    case 5:
    case 7:
        goto flag1_second;
    case 6:
    case 8:
    case 9:
        goto flag1_then_2_or_3;
    default:
        goto both_zero;
    }

inputs_1:
    switch ((u8)input1) {
    case 1:
    case 2:
        goto both_one;
    case 3:
    case 4:
    case 5:
    case 7:
        goto flag1_both;
    case 6:
    case 8:
    case 9:
        goto flag1_then_2_or_3;
    default:
        goto both_zero;
    }

inputs_2:
    switch ((u8)input1) {
    case 1:
    case 2:
        goto flag1_both;
    case 3:
    case 4:
    case 5:
    case 7:
        goto both_one;
    case 6:
        goto flag2_both_else_3_second;
    case 8:
        goto flag3_both_else_2_second;
    case 9:
        goto flag2_or_3_second;
    default:
        goto both_zero;
    }

inputs_3:
    switch ((u8)input1) {
    case 1:
        goto flag1_second;
    case 2:
        goto flag1_both;
    case 3:
    case 4:
    case 5:
    case 7:
        goto both_one;
    case 6:
        goto flag2_both_else_3_second;
    case 8:
        goto flag3_both_else_2_second;
    case 9:
        goto flag2_or_3_second;
    default:
        goto both_zero;
    }

inputs_4:
    switch ((u8)input1) {
    case 1:
        goto flag1_second;
    case 2:
        goto flag1_both;
    case 3:
    case 4:
    case 5:
    case 7:
        goto both_one;
    case 6:
    case 9:
        goto flag2_both_else_3_second;
    case 8:
        goto flag2_or_3_second;
    default:
        goto both_zero;
    }

inputs_5:
    switch ((u8)input1) {
    case 1:
    case 2:
        goto flag1_then_2_or_3;
    case 3:
    case 4:
    case 5:
        goto flag2_both_else_3_second;
    case 6:
    case 8:
    case 9:
        goto both_one;
    case 7:
        goto flag2_or_3_second;
    default:
        goto both_zero;
    }

inputs_6:
    switch ((u8)input1) {
    case 1:
        goto flag1_second;
    case 2:
        goto flag1_both;
    case 3:
    case 4:
    case 5:
    case 7:
        goto both_one;
    case 6:
        goto flag2_or_3_second;
    case 8:
    case 9:
        goto flag3_both_else_2_second;
    default:
        goto both_zero;
    }

inputs_7:
    switch ((u8)input1) {
    case 1:
    case 2:
        goto flag1_then_2_or_3;
    case 3:
    case 4:
    case 7:
        goto flag3_both_else_2_second;
    case 5:
        goto flag2_or_3_second;
    case 6:
    case 8:
    case 9:
        goto both_one;
    default:
        goto both_zero;
    }

inputs_8:
    switch ((u8)input1) {
    case 1:
    case 2:
        goto flag1_then_2_or_3;
    case 3:
    case 4:
        goto flag2_or_3_second;
    case 5:
        goto flag2_both_else_3_last;
    case 6:
    case 8:
    case 9:
        goto both_one;
    case 7:
        goto flag3_both_else_2_last;
    default:
        goto both_zero;
    }

flag1_both:
    if (func_0005c110(1) != 0) goto both_one;
    goto both_zero;
flag1_second:
    query = 1;
    goto second_from_query;
flag1_then_2_or_3:
    if (func_0005c110(1) == 0) goto both_zero;
    goto flag2_or_3_second;
flag2_both_else_3_second:
    result1 = 1;
    if (func_0005c110(2) != 0) goto first_one;
    query = 3;
    goto second_from_query;
flag3_both_else_2_second:
    result1 = 1;
    if (func_0005c110(3) != 0) goto first_one;
    query = 2;
    goto second_from_query;
flag2_or_3_second:
    result0 = 0;
    if (func_0005c110(2) != 0) goto second_one;
    query = 3;
second_from_query:
    result0 = 0;
    result1 = func_0005c110(query) != 0;
    goto publish;
flag2_both_else_3_last:
    if (func_0005c110(2) != 0) goto both_one;
    query = 3;
    goto last_query;
flag3_both_else_2_last:
    if (func_0005c110(3) != 0) goto both_one;
    query = 2;
last_query:
    if (func_0005c110(query) == 0) goto publish;
    result0 = 0;
second_one:
    result1 = 1;
    goto publish;
first_one:
    result0 = 1;
    goto publish;
both_one:
    result0 = 1;
    result1 = 1;
    goto publish;
both_zero:
    result0 = 0;
    result1 = 0;
publish:
    *first = result0;
    *second = result1;
}
