#include "game/shop_price_interface.h"

extern u8 D_8018C410[][32];
extern u16 D_8018C414[][16];
extern u32 D_8021A010[50];
extern u8 D_8021A114[6];

void func_0019B800(s32 count)
{
    s32 first;
    s32 second;
    s32 start;
    s32 category_first;
    u8 *category_count;
    u32 *category_slot;

    for (category_first = 0, category_slot = D_8021A010;
         category_first < count - 1; category_first++) {
        u32 *first_entry = category_slot++;
        for (first = category_first + 1; first < count; first++) {
            u32 first_category = 0;
            u32 second_category;
            u32 *second_entry = &D_8021A010[first];
    switch (D_8018C410[*first_entry][0]) {
    case 1:
    case 2:
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
    case 24:
        first_category = 1;
        break;
    case 14:
    case 15:
        first_category = 3;
        break;
    case 16:
    case 17:
    case 18:
    case 19:
    case 20:
        first_category = 4;
        break;
    case 21:
    case 22:
        first_category = 0;
        break;
    case 23:
        first_category = 2;
        break;
    case 25:
        first_category = 5;
        break;
    default:
        break;
    }
    second_category = 0;
    switch (D_8018C410[*second_entry][0]) {
    case 1:
    case 2:
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
    case 24:
        second_category = 1;
        break;
    case 14:
    case 15:
        second_category = 3;
        break;
    case 16:
    case 17:
    case 18:
    case 19:
    case 20:
        second_category = 4;
        break;
    case 21:
    case 22:
        second_category = 0;
        break;
    case 23:
        second_category = 2;
        break;
    case 25:
        second_category = 5;
        break;
    default:
        break;
    }
            if (second_category < first_category) {
                u32 temporary = *first_entry;
                *first_entry = *second_entry;
                *second_entry = temporary;
            }
        }
    }

    start = 0;
    category_count = D_8021A114;
    do {
        if (*category_count != 0) {
            for (first = 0; first < *category_count - 1; first++) {
                for (second = first + 1; second < *category_count; second++) {
                    u32 *first_entry = &D_8021A010[start + first];
                    s32 second_index = second + start;
                    s32 first_price;
                    s32 second_price;
                    u32 item_id = *first_entry;
                    u32 price_offset = item_id << 5;
                    if (item_id == 250) {
                        first_price = func_0019BD14();
                    } else {
                        first_price = *(u16 *)((u8 *)D_8018C414 + price_offset);
                    }
                    item_id = D_8021A010[second_index];
                    if (item_id == 250) {
                        second_price = func_0019BD14();
                    } else {
                        second_price = D_8018C414[item_id][0];
                    }
                    if (second_price < first_price) {
                        u32 *second_entry = &D_8021A010[second_index];
                        u32 temporary = *first_entry;
                        *first_entry = *second_entry;
                        *second_entry = temporary;
                    }
                }
            }
        }
        start += *category_count;
        category_count++;
    } while ((s32)category_count < (s32)(D_8021A114 + 6));
}
