typedef unsigned char u8;
typedef int s32;
extern s32 func_0005c110(s32);

/* Research reconstruction of the complete accepted owner. The numeric
 * inputs, flag IDs, and two output bytes intentionally have no terrain names.
 * Ordered flag queries and default paths are retained; no table owner is
 * activated by this source. Static mapping is separate from matching proof.
 */
void func_0013AA40(s32 input0, s32 input1, u8 *first, u8 *second) {
    u8 result0 = 0;
    u8 result1 = 0;
    s32 query;

    if ((u8)input0 == 0) {
        input0 = 18;
    }
    switch ((u8)input0) {
    case 1:
    case 2:
    case 19:
        goto inputs_0;
    case 3:
        goto inputs_1;
    case 4:
        goto inputs_2;
    case 5:
    case 7:
    case 9:
        goto inputs_3;
    case 6:
    case 8:
    case 10:
        goto inputs_4;
    case 11:
    case 12:
    case 14:
    case 16:
        goto inputs_5;
    case 13:
    case 15:
    case 17:
    case 18:
        goto inputs_6;
    case 20:
    case 21:
    case 22:
        goto inputs_7;
    case 23:
    case 24:
    case 25:
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
        goto flag4_both;
    case 4:
    case 5:
    case 7:
    case 9:
        goto flag4_first_when_second_2;
    case 6:
    case 8:
    case 10:
    case 11:
    case 12:
    case 14:
    case 16:
        goto flag4_then_5_6_7;
    case 13:
    case 15:
    case 17:
    case 18:
        goto flag4_then_5_6_7_and_8_9_10;
    default:
        goto both_zero;
    }

inputs_1:
    switch ((u8)input1) {
    case 1:
    case 2:
        goto flag4_both;
    case 3:
    case 4:
    case 5:
    case 7:
    case 9:
        goto both_one;
    case 6:
        goto flag5_both_else_6_7_second;
    case 8:
        goto flag6_both_else_5_7_second;
    case 10:
        goto flag7_both_else_5_6_second;
    case 11:
    case 12:
    case 14:
    case 16:
        goto flags5_6_7_second;
    case 13:
    case 15:
    case 17:
    case 18:
        goto flags5_6_7_then_8_9_10;
    default:
        goto both_zero;
    }

inputs_2:
    switch ((u8)input1) {
    case 1:
    case 2:
        goto flag4_first_when_second_2;
    case 3:
    case 4:
    case 5:
    case 7:
    case 9:
        goto both_one;
    case 6:
        goto flag5_both_else_6_7_second;
    case 8:
        goto flag6_both_else_5_7_second;
    case 10:
        goto flag7_both_else_5_6_second;
    case 11:
    case 12:
    case 14:
    case 16:
        goto flags5_6_7_second;
    case 13:
    case 15:
    case 17:
    case 18:
        goto flags5_6_7_then_8_9_10;
    default:
        goto both_zero;
    }

inputs_3:
    switch ((u8)input1) {
    case 1:
    case 2:
        goto flag4_second;
    case 3:
    case 4:
    case 5:
    case 7:
    case 9:
        goto both_one;
    case 6:
        goto first5_flag5;
    case 8:
        goto first7_flag6;
    case 10:
        goto first9_flag7;
    case 11:
    case 12:
    case 14:
    case 16:
        goto first5_7_9_flags5_6_7;
    case 13:
    case 15:
    case 17:
    case 18:
        goto flags5_6_7_then_8_9_10;
    default:
        goto both_zero;
    }

inputs_4:
    switch ((u8)input1) {
    case 1:
    case 2:
        goto flag4_then_5_6_7;
    case 3:
    case 4:
    case 5:
    case 7:
    case 9:
        goto first6_8_10_flags5_6_7;
    case 6:
    case 8:
    case 10:
    case 11:
    case 12:
    case 14:
    case 16:
        goto both_one;
    case 13:
    case 15:
    case 17:
    case 18:
        goto flags8_9_10_second;
    default:
        goto both_zero;
    }

inputs_5:
    switch ((u8)input1) {
    case 1:
    case 2:
        goto flag4_then_5_6_7;
    case 3:
    case 4:
    case 5:
    case 7:
    case 9:
        goto flags5_6_7_second;
    case 6:
    case 8:
    case 10:
    case 11:
    case 12:
    case 14:
    case 16:
        goto both_one;
    case 13:
    case 15:
    case 17:
    case 18:
        goto first12_14_16_flags8_9_10;
    default:
        goto both_zero;
    }

inputs_6:
    switch ((u8)input1) {
    case 1:
    case 2:
        goto flag4_then_5_6_7;
    case 3:
    case 4:
    case 5:
    case 7:
    case 9:
        goto flags5_6_7_second;
    case 6:
    case 8:
    case 10:
    case 11:
    case 12:
    case 14:
    case 16:
        goto first13_15_17_flags8_9_10;
    case 13:
    case 15:
    case 17:
    case 18:
        goto both_one;
    default:
        goto both_zero;
    }

inputs_7:
    switch ((u8)input1) {
    case 1:
    case 2:
        goto flag4_second;
    case 3:
    case 4:
    case 5:
    case 7:
    case 9:
        goto both_one;
    case 6:
        goto first20_flag5;
    case 8:
        goto first21_flag6;
    case 10:
        goto first22_flag7;
    case 11:
    case 12:
    case 14:
    case 16:
        goto first20_21_22_flags5_6_7;
    case 13:
    case 15:
    case 17:
    case 18:
        goto flags5_6_7_then_8_9_10;
    default:
        goto both_zero;
    }

inputs_8:
    switch ((u8)input1) {
    case 1:
    case 2:
        goto flag4_then_5_6_7;
    case 3:
    case 4:
    case 5:
    case 7:
    case 9:
        goto flags5_6_7_second;
    case 6:
    case 8:
    case 10:
    case 11:
    case 12:
    case 14:
    case 16:
        goto both_one;
    case 13:
    case 15:
    case 17:
    case 18:
        goto first23_24_25_flags8_9_10;
    default:
        goto both_zero;
    }

flag4_both:
    if (func_0005c110(4) != 0) goto both_one;
    goto both_zero;
flag4_first_when_second_2:
    if (func_0005c110(4) == 0) goto both_zero;
    result0 = (u8)input1 == 2;
    result1 = 1;
    goto publish;
flag4_then_5_6_7:
    if (func_0005c110(4) == 0) goto both_zero;
    goto flags5_6_7_second;
flag4_then_5_6_7_and_8_9_10:
    if (func_0005c110(4) == 0) goto both_zero;
    goto flags5_6_7_then_8_9_10;
flag5_both_else_6_7_second:
    if (func_0005c110(5) != 0) goto both_one;
    query = 6;
    goto query_then_7;
flag6_both_else_5_7_second:
    if (func_0005c110(6) != 0) goto both_one;
    query = 5;
    goto query_then_7;
flag7_both_else_5_6_second:
    if (func_0005c110(7) != 0) goto both_one;
    if (func_0005c110(5) != 0) goto second_one;
    query = 6;
    goto last_query;
flag4_second:
    query = 4;
    goto last_query;
first5_flag5:
    if ((u8)input0 == 5 && func_0005c110(5) != 0) goto both_one;
    goto flags5_6_7_second;
first7_flag6:
    if ((u8)input0 == 7 && func_0005c110(6) != 0) goto both_one;
    goto flags5_6_7_second;
first9_flag7:
    if ((u8)input0 == 9 && func_0005c110(7) != 0) goto both_one;
    goto flags5_6_7_second;
first5_7_9_flags5_6_7:
    if ((u8)input0 == 5 && func_0005c110(5) != 0) goto both_one;
    if ((u8)input0 == 7 && func_0005c110(6) != 0) goto both_one;
    if ((u8)input0 == 9 && func_0005c110(7) != 0) goto both_one;
    goto flags5_6_7_second;
first20_flag5:
    if ((u8)input0 == 20 && func_0005c110(5) != 0) goto both_one;
    goto flags5_6_7_second;
first21_flag6:
    if ((u8)input0 == 21 && func_0005c110(6) != 0) goto both_one;
    goto flags5_6_7_second;
first22_flag7:
    if ((u8)input0 == 22 && func_0005c110(7) != 0) goto both_one;
    goto flags5_6_7_second;
first20_21_22_flags5_6_7:
    if ((u8)input0 == 20 && func_0005c110(5) != 0) goto both_one;
    if ((u8)input0 == 21 && func_0005c110(6) != 0) goto both_one;
    if ((u8)input0 == 22 && func_0005c110(7) != 0) goto both_one;
    goto flags5_6_7_second;
first6_8_10_flags5_6_7:
    if ((u8)input0 == 6 && func_0005c110(5) != 0) goto both_one;
    if ((u8)input0 == 8 && func_0005c110(6) != 0) goto both_one;
    if ((u8)input0 == 10 && func_0005c110(7) != 0) goto both_one;
    goto flags5_6_7_second;
first12_14_16_flags8_9_10:
    if ((u8)input0 == 12 && func_0005c110(8) != 0) goto both_one;
    if ((u8)input0 == 14 && func_0005c110(9) != 0) goto both_one;
    if ((u8)input0 == 16 && func_0005c110(10) != 0) goto both_one;
    goto flags8_9_10_second;
first23_24_25_flags8_9_10:
    if ((u8)input0 == 23 && func_0005c110(8) != 0) goto both_one;
    if ((u8)input0 == 24 && func_0005c110(9) != 0) goto both_one;
    if ((u8)input0 == 25 && func_0005c110(10) != 0) goto both_one;
    goto flags8_9_10_second;
first13_15_17_flags8_9_10:
    if ((u8)input0 == 13 && func_0005c110(8) != 0) goto both_one;
    if ((u8)input0 == 15 && func_0005c110(9) != 0) goto both_one;
    if ((u8)input0 == 17 && func_0005c110(10) != 0) goto both_one;
    goto flags8_9_10_second;
flags5_6_7_then_8_9_10:
    if (func_0005c110(5) != 0) goto flags8_9_10_second;
    if (func_0005c110(6) != 0) goto flags8_9_10_second;
    if (func_0005c110(7) != 0) goto flags8_9_10_second;
    goto both_zero;
flags8_9_10_second:
    if (func_0005c110(8) != 0) goto second_one;
    if (func_0005c110(9) != 0) goto second_one;
    query = 10;
    goto last_query;
flags5_6_7_second:
    if (func_0005c110(5) != 0) goto second_one;
    query = 6;
query_then_7:
    if (func_0005c110(query) != 0) goto second_one;
    query = 7;
last_query:
    result0 = 0;
    result1 = func_0005c110(query) != 0;
    goto publish;
second_one:
    result0 = 0;
    result1 = 1;
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
