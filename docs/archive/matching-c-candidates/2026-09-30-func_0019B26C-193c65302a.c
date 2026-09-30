typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef signed int s32;

extern u32 D_80196A6C;
extern u16 D_8018E6D2[];
extern u16 D_8018C414[];
extern u8 D_80193AC3[];
extern u8 D_80196B03[];
extern u16 func_8016B738(u16 item_id);
extern u16 func_0016B6FC(u16 item_id);
extern u32 func_0019BD14(void);

u8 func_0019B26C(u16 item_id, u8 kind)
{
    u16 quantity;
    u16 slot;
    s32 remaining;

    if (kind == 0) {
        s32 price;
        s32 count;
        quantity = D_80196A6C / D_8018E6D2[item_id * 6];
        slot = func_8016B738(item_id);
        if (slot == 0x1FF) {
            if (quantity >= 100) {
                quantity = 99;
            }
        } else {
            remaining = 99 - D_80193AC3[slot * 4];
            count = quantity;
            if (count > remaining) {
                count = remaining;
            }
            quantity = count;
        }
        price = D_8018E6D2[item_id * 6];
        if (quantity * price > 99999) {
            quantity = 99999 / price;
        }
    } else {
        s32 price;
        s32 count;
        if (item_id == 0xFA) {
            price = func_0019BD14();
        } else {
            price = D_8018C414[item_id * 16];
        }
        quantity = D_80196A6C / (u32)price;
        slot = func_0016B6FC(item_id);
        if (slot == 0x1FF) {
            if (quantity >= 100) {
                quantity = 99;
            }
        } else {
            remaining = 99 - D_80196B03[slot * 4];
            count = quantity;
            if (count > remaining) {
                count = remaining;
            }
            quantity = count;
        }
        if (quantity * price > 99999) {
            quantity = 99999 / price;
        }
    }
    return quantity;
}
