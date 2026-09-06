typedef unsigned char u8;
typedef unsigned short u16;
typedef struct { u8 bytes[25]; } Record25;

extern Record25 g_func_001957D0_source_records[];
extern void *func_80070F30(int);
extern void func_800712C4(void *);
extern void func_80093380(void *, int);
extern u16 func_0014F300(u8);
extern void func_00130E60(u16, int);

void func_00195D9C(u8 index, u8 preset0, u8 preset1, u8 preset2)
{
    u8 *buffer;
    u8 *cursor;
    u8 *destination;
    u16 capacity;
    int count;
    int phase;
    int kind;
    int i;

    buffer = func_80070F30(20);
    func_80093380(buffer, 20);
    capacity = func_0014F300(index);
    count = 0;
    if (preset0 || preset1 || preset2) {
        phase = 0;
        cursor = buffer;
        while (count < capacity) {
            switch (phase) {
            case 0:
                switch (preset0) {
                case 1:
                    *cursor++ = 1;
                    cursor += 4;
                    count += 5;
                    break;
                case 2:
                    *cursor++ = 1;
                    *cursor++ = 1;
                    cursor += 2;
                    count += 4;
                    break;
                case 3:
                    *cursor++ = 1;
                    *cursor++ = 1;
                    *cursor++ = 2;
                    cursor += 3;
                    count += 6;
                    break;
                case 4:
                    *cursor++ = 2;
                    *cursor++ = 2;
                    cursor += 2;
                    count += 4;
                    break;
                case 5:
                    *cursor++ = 2;
                    *cursor++ = 2;
                    *cursor++ = 3;
                    cursor += 3;
                    count += 6;
                    break;
                case 6:
                    *cursor++ = 3;
                    *cursor++ = 3;
                    cursor += 2;
                    count += 4;
                    break;
                }
                phase = 1;
                break;
            case 1:
                switch (preset1) {
                case 1:
                    *cursor++ = 4;
                    *cursor++ = 4;
                    count += 2;
                    break;
                case 2:
                    *cursor++ = 4;
                    *cursor++ = 5;
                    count += 2;
                    break;
                case 3:
                    *cursor++ = 5;
                    *cursor++ = 5;
                    count += 2;
                    break;
                }
                phase = 2;
                break;
            case 2:
                switch (preset2) {
                case 1:
                    *cursor++ = 6;
                    count++;
                    break;
                case 2:
                    *cursor++ = 6;
                    *cursor++ = 6;
                    count += 2;
                    break;
                }
                phase = 0;
                break;
            }
        }
    }
    destination = &g_func_001957D0_source_records[index].bytes[13];
    func_80093380(destination, 10);
    if (preset0 || preset1 || preset2) {
        kind = 1;
        i = 0;
        count = 0;
        while (count < capacity && kind < 7) {
            if (i >= capacity) {
                kind++;
                i = 0;
            }
            if (buffer[i] == kind) {
                destination[count++] = kind;
                if (index < 30)
                    func_00130E60(kind, 1);
            }
            i++;
        }
    }
    func_800712C4(buffer);
}
