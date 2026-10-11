typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef int s32;
typedef struct { u8 bytes[25]; } Record25;

extern Record25 g_func_001957D0_source_records[];
extern void *func_80070F30(int);
extern void func_800712C4(void *);
extern void func_80093380(void *, int);
extern u32 func_0014F300(s32);
extern void func_00130E60(u16, int);

void func_00195D9C(u8 index, u8 preset0, u8 preset1, u8 preset2)
{
    u8 *buffer;
    int position;
    int primaryValue;
    u8 *destination;
    int capacity;
    int count;
    int phase;
    int kind;
    int scanIndex;


    int secondaryValue;
    u32 sourceIndex;
    int updateInventory;
    u8 *scan;
    u8 *bufferEnd;
    u8 *destinationEnd;

    buffer = func_80070F30(20);
    func_80093380(buffer, 20);
    capacity = (u16)func_0014F300(index);
    if (((primaryValue = preset0) != 0) |
        ((secondaryValue = preset1) != 0)) {
        count = 0;
        goto construction_entry;
    }
    if (preset2) {
        count = 0;
construction_entry:
        phase = 0;
        if (phase < capacity) {



        position = 0;
        do {
            switch (phase) {
            case 0:
                switch ((u8)primaryValue) {
                case 1:
                    buffer[position++] = 1;
                    position += 4;
                    count += 5;
                    break;
                case 2:
                    buffer[position++] = 1;
                    count++;
                    buffer[position++] = 1;
                    position += 2;
                    count += 3;
                    break;
                case 3:
                    buffer[position++] = 1;
                    count++;
                    buffer[position++] = 1;
                    count++;
                    buffer[position++] = 2;
                    position += 3;
                    count += 4;
                    break;
                case 4:
                    buffer[position++] = 2;
                    count++;
                    buffer[position++] = 2;
                    position += 2;
                    count += 3;
                    break;
                case 5:
                    buffer[position++] = 2;
                    count++;
                    buffer[position++] = 2;
                    count++;
                    buffer[position++] = 3;
                    position += 3;
                    count += 4;
                    break;
                case 6:
                    buffer[position++] = 3;
                    count++;
                    buffer[position++] = 3;
                    position += 2;
                    count += 3;
                    break;
                }
                phase = 1;
                break;
            case 1:
                switch ((u8)secondaryValue) {
                case 1:
                    buffer[position++] = 4;
                    count++;
                    buffer[position++] = 4;
                    count++;
                    break;
                case 2:
                    buffer[position++] = 4;
                    count++;
                    buffer[position++] = 5;
                    count++;
                    break;
                case 3:
                    buffer[position++] = 5;
                    count++;
                    buffer[position++] = 5;
                    count++;
                    break;
                }
                phase = 2;
                break;
            case 2:
                switch (preset2) {
                case 1:
                    buffer[position++] = 6;
                    count++;
                    break;
                case 2:
                    buffer[position++] = 6;
                    count++;
                    buffer[position++] = 6;
                    count++;
                    break;
                }
                phase = 0;
                break;
            }
        } while (count < capacity);
        }
    }
    sourceIndex = index;
    destination = &g_func_001957D0_source_records[sourceIndex].bytes[13];
    func_80093380(destination, 10);
    if (preset0 || preset1 || preset2) {
        kind = 1;
        scanIndex = 0;
        count = 0;
        while (count < capacity && kind < 7) {
                if (scanIndex >= capacity) {
                    kind++;
                    scanIndex = 0;
                }
                if (buffer[scanIndex] == kind) {
                    destination[count++] = kind;
                    if (sourceIndex < 30)
                        func_00130E60(kind, 1);
                }
                scanIndex++;
        }
    }
    func_800712C4(buffer);
}
