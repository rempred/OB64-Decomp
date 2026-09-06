typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_801CE8C0;
extern u8 *D_801CE8BC;
extern u8 D_801CE8F8;
s32 func_0020C120(void *);
s32 func_0020C2C0(void *);
s32 func_0020C32C(void *);
void *func_0020C478(s32);
s32 func_00214BDC(void *);
void func_0021D200(s32, s32, void *);
s32 func_0022B1F4(void *, s32 *);
s32 func_0022BFF8(void *, s32 *);
s32 func_0022C78C(void *, s32 *);
s32 func_0022D14C(void *, s32 *);
s32 func_0022EC08(void *, s32 *);
s32 func_0022EDD4(void *, s32 *);
void func_0022EF50(void *);

s32 func_0022F2BC(void *arg0, s32 *arg1)
{
    s32 count, limit, current, requested, flags, scanIndex, predicate, result;
    s32 scanCurrent, scanRequested, initialCount, returnTime;
    u8 *returnGlobal;
    u32 earlyLoaded, middleLoaded, scanLoaded;
    register u32 cap;
    register u32 scanCap;
    u8 mode;
    u8 *global;
    u8 *owner;
    void *entry;

    if (arg0 == 0) goto no_action;
    initialCount = *(s32 *)((u8 *)arg0 + 0x6C);
    limit = *(s32 *)((u8 *)arg0 + 0x70);
    *(s32 *)((u8 *)arg0 + 0x8C) = 0;
    *(s32 *)((u8 *)arg0 + 0x88) = 0;
    *(s32 *)((u8 *)arg0 + 0x84) = 0;
    if (initialCount >= limit) goto no_action;

    global = D_801CE8C0;
    global[0x818]++;
    if (func_0020C2C0(arg0) != 0 || func_0020C32C(arg0) != 0) {
        current = *(s32 *)((u8 *)arg0 + 0x94);
        requested = *arg1;
        if (current < requested) current = requested;
        earlyLoaded = (u32)D_801CE8C0;
        *(s32 *)((u8 *)arg0 + 0x94) = current;
        earlyLoaded = *(u32 *)(earlyLoaded + 0x828);
        if (earlyLoaded < (u32)current) cap = current;
        else cap = earlyLoaded;
        *(u32 *)((u8 *)arg0 + 0x94) = cap;
        func_0021D200(0x1C, cap, arg0);
        count = *(s32 *)((u8 *)arg0 + 0x6C);
        returnTime = *(s32 *)((u8 *)arg0 + 0x94);
        result = 0;
        count++;
        *(s32 *)((u8 *)arg0 + 0x6C) = count;
        *arg1 = returnTime;
        return result;
    }
    flags = *(s32 *)((u8 *)arg0 + 0x40);
    if (flags & 8) return func_0022EC08(arg0, arg1);
    if (flags & 4) return func_0022EDD4(arg0, arg1);

    owner = D_801CE8C0;
    count = *(s32 *)((u8 *)arg0 + 0x6C);
    if (count != *(s32 *)owner || *(s32 *)((u8 *)arg0 + 0x70) < count) {
        current = *(s32 *)((u8 *)arg0 + 0x94);
        requested = *arg1;
        if (current < requested) current = requested;
        *(s32 *)((u8 *)arg0 + 0x94) = current;
        middleLoaded = *(u32 *)(owner + 0x828);
        if (middleLoaded < (u32)current) cap = current;
        else cap = middleLoaded;
        *(u32 *)((u8 *)arg0 + 0x94) = cap;
        func_0021D200(0x1C, cap, arg0);
        count = *(s32 *)((u8 *)arg0 + 0x6C);
        returnTime = *(s32 *)((u8 *)arg0 + 0x94);
        result = 0;
        count++;
        *(s32 *)((u8 *)arg0 + 0x6C) = count;
        *arg1 = returnTime;
        return result;
    }
    if (func_00214BDC(arg0) != 0) {
        scanIndex = 0;
        do {
            entry = func_0020C478(scanIndex);
            predicate = func_0020C2C0(entry);
            scanIndex++;
            if (predicate == 0) *(s32 *)((u8 *)entry + 0x6C) = *(s32 *)((u8 *)entry + 0x70);
        } while (scanIndex < 20);
        scanCurrent = *(s32 *)((u8 *)arg0 + 0x94);
        scanRequested = *arg1;
        if (scanCurrent < scanRequested) scanCurrent = scanRequested;
        scanLoaded = (u32)D_801CE8C0;
        *(s32 *)((u8 *)arg0 + 0x94) = scanCurrent;
        scanLoaded = *(u32 *)(scanLoaded + 0x828);
        if (scanLoaded < (u32)scanCurrent) scanCap = scanCurrent;
        else scanCap = scanLoaded;
        *(u32 *)((u8 *)arg0 + 0x94) = scanCap;
        func_0021D200(0x1C, scanCap, arg0);
        count = *(s32 *)((u8 *)arg0 + 0x6C);
        scanCurrent = *(s32 *)((u8 *)arg0 + 0x94);
        count++;
        *(s32 *)((u8 *)arg0 + 0x6C) = count;
        *arg1 = scanCurrent;
        returnGlobal = D_801CE8BC;
        result = 1;
        returnGlobal[0x6088] = 1;
        return result;
    }
    if (*(s32 *)((u8 *)arg0 + 0x4C) == 0xA4) D_801CE8F8++;
    func_0022EF50(arg0);
    mode = *(u8 *)((u8 *)arg0 + 0x78);
    if (mode == 0) {
        if (func_0020C120(arg0) != 0) result = func_0022C78C(arg0, arg1);
        else result = func_0022B1F4(arg0, arg1);
    } else if (mode == 1) result = func_0022BFF8(arg0, arg1);
    else result = func_0022D14C(arg0, arg1);
    if (result != 0) return result;
    *(s32 *)((u8 *)arg0 + 0x68) = -1;
no_action:
    return 0;
}
