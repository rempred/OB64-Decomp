typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct ItemRecord { u16 item; u8 capacity; u8 count; } ItemRecord;
extern ItemRecord D_80193AC0[];
extern u8 *D_80196AF8;
extern u16 D_800E8100;
extern u8 D_801939D4, D_801939D5;
extern u8 D_8019A384[], D_8019A3DC[], D_8019A41C[];
extern void *func_00001330(s32);
extern void func_000016C4(void *);
extern void *func_0002e138(u32);
extern s32 rand(void);
extern u8 func_00045440(s32);
extern u8 func_00045460(s32);
extern s32 func_00041098(u8,s32,u16,u8);
extern u16 func_000c4650(u16);
extern void func_000c4a40(void *,s32);
extern void func_000c54c0(s32);
extern void func_000c6fe8(u16);
extern u16 func_000c8d28(s16 *);
extern void func_000c8f04(s16 *);
extern void func_000ae30c(s32,s32,s32);
extern void func_000b1f00(void);
extern void func_000b1f4c(s32,s32,s32);
extern void func_000b4a70(u32);
extern void func_000b4b08(u32);
extern void func_000b4bb8(void);
extern void func_000b6b70(void),func_000b6ba8(void);
extern void func_000b8a94(void),func_000b8aec(void),func_000b8b60(void),func_000b8d70(void);
extern s32 func_000b8e70(s32);
extern void func_000b9234(s32);
extern void func_000ba2c0(s32,s32);
extern u8 func_000bc464(u16);
extern void func_000bc7e4(s32,s32),func_000bc828(s32,s32);
/* Runtime overlay entry; provider spelling must be reconciled at integration. */
extern s32 func_80197B70(void *);
#define B(p,o) (*(u8 *)((p)+(o)))
#define H(p,o) (*(u16 *)((p)+(o)))
#define SH(p,o) (*(s16 *)((p)+(o)))
#define W(p,o) (*(s32 *)((p)+(o)))
#define PTR(p,o) (*(void **)((p)+(o)))
void func_000c9850(void)
{
    u8 *state = D_80196AF8;
    s16 *selection = (s16 *)(state + 0x1BDA);
    s32 index, output, active, value, next_state, slot_index;
    u16 item, entry, buttons, action;
    u8 old_entry;
    u8 *base, *other, *squad;
    void **resources;
    ItemRecord *record;
    switch (SH(state,0x122)) {
    case 0: {

        u8 *base1, *base2, *base3, *base4, *base5;

        PTR(D_80196AF8,0x1E28) = 0;
        for(slot_index=0;slot_index<7;slot_index++) if(B(D_80196AF8,0x1E00 + slot_index)==7) break;
        if(slot_index==7) {
            H(D_80196AF8,0x122)=99;
            func_000b4a70(0x40016);
            break;
        }
        B(D_80196AF8,0x1DFE)=3;
        base1=D_80196AF8;
        B(base1,0x1DF6 + B(base1,0x9D))=selection[0];
        base2=D_80196AF8;
        B(base2,0x1DEE + B(base2,0x9D))=selection[1];
        B(D_80196AF8,0x9D)=slot_index;
        resources=func_00001330(0xD0);
        PTR(D_80196AF8,0x1E28)=resources;
        resources[0]=func_0002e138(0x1DE9BC0);
        resources[1]=func_0002e138(0x1DE9FA4);
        base3=D_80196AF8;
        selection[0]=B(base3,0x1DF6 + B(base3,0x9D));
        selection[1]=B(base3,0x1DEE + B(base3,0x9D));
        value=func_000bc464((u16)(B(base3,0x1E00 + B(base3,0x9D))-1));
        B(D_80196AF8,0x1DED)=value;
        base4=D_80196AF8;
        func_000b4b08(D_80193AC0[H(base4,0x1BEE + selection[0]*2)].item|0x140000);
        B(D_80196AF8,0x9C)=1;
        base5=D_80196AF8;
        selection[3]=B(base5,0x1DED)-1;
        B(base5,0x1E2C)=1;
        B(D_80196AF8,0x9A)=1;
        { u8 *next = D_80196AF8; H(next,0x122)++; break; }
    }
    case 1: {

        u8 target_mode, group_mode;
        u8 *base, *other, *state, *squad;
        u8 *selection_state;
        s32 entry;
        selection_state=D_80196AF8;
        selection=(s16 *)(selection_state+0x1BDA);
        old_entry=B(selection_state,0x1BEF + selection[0]*2);
        action=func_000c8d28(selection);
        switch (action) {
        case 1: {
            entry=H(D_80196AF8,0x1BEE + SH(selection_state,0x1BDA)*2);
            if(!(func_00045460(D_80193AC0[entry].item)&1)) func_000b4a70(0x40018);
            else if(D_80193AC0[entry].count==D_80193AC0[entry].capacity) func_000b4a70(0x40017);
            else {
                func_000c54c0(6);
                B(D_80196AF8,0x9A)=2;
                H(selection_state,0x1BE2)=H(selection_state,0x1BDA);
                func_000b6b70();
                item=D_80193AC0[entry].item;
                slot_index=0;
                func_000c4650(item);
                for(;slot_index<10;slot_index++) {
                    u8 *clear_state=D_80196AF8;
                    W(clear_state,0x24FC + slot_index*4)=0;
                    B(clear_state,0x1E3F + slot_index*16)=0;
                }
                target_mode=func_00045440(item);
                group_mode=2;
                if(target_mode==1) {
                    u8 *single_state, *single_current;
                    next_state=2;
                    single_state=D_80196AF8;
                    B(single_state,0x14D)=1;
                    single_current=D_80196AF8;
                    H(single_state,0x136)=14;
                    H(single_current,0x130)=14;
                    W(single_current,0x10AC)=777;
                    H(single_current,0x10C4)=1;
                    B(single_current,0x10A9)=3;
                    func_000b1f4c(0,0,2);
                } else {
                    u8 *group_state, *group_current;
                    group_state=D_80196AF8;
                    B(group_state,0x14D)=group_mode;
                    group_current=D_80196AF8;
                    next_state=3;
                    H(group_state,0x136)=12;
                    H(group_current,0x130)=12;
                }
                func_000ba2c0(0,next_state);
                func_000b8a94();
                func_000b8d70();
                B(D_80196AF8,0x9C)=0;
                base=D_80196AF8;
                H(base,0x122)++;
                func_000ae30c(10,0,0);
            }
            break;
        }
        case 2:
            func_000c54c0(8);
            H(D_80196AF8,0x122)=99;
            break;
        default: func_000c8f04(selection); break;
        }
        base=D_80196AF8;
        entry=H(base,0x1BEE + selection[0]*2);
        if(entry!=old_entry) func_000b4b08(D_80193AC0[entry].item|0x140000);
        break;
    }
    case 2: {
        u8 *details_base, *confirm_base, *cancel_base, *other, *state, *squad;
        buttons=D_800E8100;
        if(buttons&0x1000) {
            details_base=D_80196AF8;
            if(B(details_base,0x14D)==1) {
                s16 selected_character=SH(details_base,0x18A);
                if(selected_character==255) { func_000c54c0(7); break; }
                D_801939D4=selected_character;
                func_000c4a40(details_base+0x610,0); func_000ae30c(13,1,0); break;
            } else {
                entry=H(details_base,0x18C);
                if(entry>=128) { func_000c54c0(7); break; }
                D_801939D5=entry;
                func_000c4a40(details_base+0x610,2); func_000ae30c(13,1,0); break;
            }

        } else if(buttons&0x8000) {
            confirm_base=D_80196AF8;
            if(B(confirm_base,0x14D)==1) {
                s32 confirmed_character=SH(confirm_base,0x18A);
                if(confirmed_character==255) { func_000c54c0(7); break; }
                { u8 *character_flags=confirm_base+0x1872; buttons=character_flags[confirmed_character*2]; }
                if(buttons&0x10) { func_000b4a70(0x4001F); break; }
                if(buttons&0x80) { func_000b4a70(0x4001E); break; }
                func_000c54c0(6);
                B(D_80196AF8,0x99)=1;
                func_000c6fe8(H(D_80196AF8,0x18A));
                B(D_80196AF8,0x609)=0;
                func_000b8aec();
                { u8 *next = D_80196AF8; H(next,0x122)++; break; }
            } else {
                entry=H(confirm_base,0x18C);
                if(entry&0x80) { func_000c54c0(7); break; }
                { u8 *group_flags=confirm_base+0x117D; if(group_flags[entry*0x36]&0x10) { func_000b4a70(0x4001F); break; } }
                func_000c54c0(6);
                B(D_80196AF8,0x9C)=1;
                { u8 *next = D_80196AF8; H(next,0x122)+=2; }
            }
        } else if(buttons&0x4000) {
            func_000c54c0(1);
            func_000bc828(128,2);
            func_000bc7e4(128,2);
            B(D_80196AF8,0x10A9)=0;
            cancel_base=D_80196AF8;
            H(cancel_base,0x10C4)=0;
            B(cancel_base,0x9A)=1;
            func_000b9234(0);
            func_000b6ba8();
            func_000b9234(17);
            B(D_80196AF8,0x9C)=1;
            { u8 *next = D_80196AF8; H(next,0x122)--; }
            func_000ae30c(10,0,0);
        } else func_000b1f00();
        break;

    }
    case 3: {
        u16 item;
        s32 result, effect;
        u8 *cancel_next;
        u8 *phase0, *phase1, *phase2, *phase3, *phase4, *phase5, *phase6, *phase7, *other, *state, *squad;
        buttons=D_800E8100;
        if(buttons&0x1000) {
            phase0=D_80196AF8;
            D_801939D4=H(phase0,0x18A);
            func_000c4a40(phase0+0x610,5);
            { func_000ae30c(13,1,0); break; }
        } else if(buttons&0x8000) {
            B(D_80196AF8,0x10A9)=0;
            phase1=D_80196AF8;
            H(phase1,0x10C4)=0;
            D_80193AC0[H(phase1,0x1BEE + selection[0]*2)].count--;
            func_000bc7e4(128,2);
            phase2=D_80196AF8;
            item=D_80193AC0[H(phase2,0x1BEE + selection[0]*2)].item;
            result=func_00041098(0,0,item,B(phase2,0x18B));
            phase3=D_80196AF8;
            W(phase3,0x24FC)=result;
            W(phase3,0x2500)=result;
            other=D_8019A41C;
            PTR(phase3,0x1E30)=D_8019A384;
            if(W(phase3,0x24FC)>0) other=D_8019A3DC;
            B(phase3,0x1E3F)=128;
            state=D_80196AF8;
            PTR(phase3,0x1E40)=other;
            B(state,0x1E4F)=128;
            phase4=D_80196AF8;
            B(phase4,0x1E4C)=D_80193AC0[H(phase4,0x1BEE + selection[0]*2)].item;
            if(item<6) func_000c54c0(19); else if(item>=8) func_000c54c0(21); else func_000c54c0(20);
            phase5=D_80196AF8;
            B(phase5,0xA0)|=128;
            phase6=D_80196AF8;
            H(phase6,0x12E)=10;
            H(phase6,0x122)=5;
        } else if(buttons&0x4000) {
            func_000c54c0(1);
            func_000b8b60();
            B(D_80196AF8,0x99)=0;
            phase7=D_80196AF8;
            B(phase7,0x10A9)=3;
            cancel_next=D_80196AF8;
            W(phase7,0x10AC)=777;
            H(phase7,0x10C4)=1;
            H(cancel_next,0x122)--;
        }
        break;
    }
    case 4: {
        u16 item;
        u8 *base, *other, *state, *squad;
        func_000c54c0(19);
        base=D_80196AF8;
        entry=H(base,0x1BEE + selection[0]*2);
        item=D_80193AC0[entry].item;
        D_80193AC0[entry].count--;
        func_000bc7e4(128,2);
        func_000bc828(128,2);
        output=0;
        for(index=0;index<9;index++) {
            base=D_80196AF8;
            if(B(base,0x1180 + H(base,0x18C)*0x36 + index)!=255) {
                if(item==20 && output==0) {
                    value=rand()%5+1;
                    base=D_80196AF8;
                    W(base,0x24FC + output*4)=value;
                    W(base,0x2500 + output*4)=value;
                } else {
                    value=func_00041098(0,0,item,B(base,0x18B));
                    base=D_80196AF8;
                    W(base,0x24FC + output*4)=value;
                    W(base,0x2500 + output*4)=value;
                }
                base=D_80196AF8;
                PTR(base,0x1E30 + output*16)=D_8019A384;
                B(base,0x1E3F + output*16)=128;
                output+=2;
            }
        }
        base=D_80196AF8;
        B(base,0xA0)|=128;
        base=D_80196AF8;
        H(base,0x12E)=10;
        H(base,0x122)++;
        break;
    }
    case 5: {
        s32 effect_offset, index;
        u8 *other, *state, *squad;

        active=0;
        index=0;
        effect_offset=0x1E30;
        for(;index<10;index++,effect_offset+=16) if(func_80197B70(D_80196AF8+effect_offset)) active++;
        
        if(H(D_80196AF8,0x12E)==1) {
            item=D_80193AC0[H(D_80196AF8,0x1BEE + selection[0]*2)].item;
            if(func_00045440(item)==1) {
                s32 value;
                if(W(D_80196AF8,0x24FC)<0) value=W(D_80196AF8,0x24FC);
                else { value=0; if(W(D_80196AF8,0x24FC)>0) value=W(D_80196AF8,0x24FC); }
                func_00041098(1,value,item,B(D_80196AF8,0x18B));
            } else if(item==20) {
                s32 value;
                
                value=W(D_80196AF8,0x24FC);
                if(value!=0) {
                    squad=D_80196AF8+H(D_80196AF8,0x18C)*0x36;
                    if(B(squad,0x119B)+value>100) B(squad,0x119B)=100;
                    else B(squad,0x119B)+=value;
                    W(D_80196AF8,0x24FC)=0;
                }
            } else {
                output=0;
                for(index=0;index<9;index++) {
                    
                    if(B(D_80196AF8,0x1180 + H(D_80196AF8,0x18C)*0x36 + index)!=255) {
                        s32 value;
                        if(W(D_80196AF8,0x24FC + output*4)<0) { value=W(D_80196AF8,0x24FC + output*4); goto apply_group_value; }
                        value=W(D_80196AF8,0x24FC + output*4);
                        { s32 positive=0; if(value>0) positive=value; value=positive; }
apply_group_value:
                        
                        output+=2;
                        func_00041098(1,value,item,B(D_80196AF8,0x1180 + H(D_80196AF8,0x18C)*0x36 + index));
                    }
                }
            }
        }
        if(active) B(D_80196AF8,0x1E2D)=1;
        else { B(D_80196AF8,0x1E2D)=0; { u8 *next = D_80196AF8; H(next,0x122)++; break; } }
        break;
    }
    case 6: {
        u8 *base, *other, *state, *squad;
        B(D_80196AF8,0x1E2D)=0;
        base=D_80196AF8;
        H(base,0x12E)=16;
        H(base,0x122)++;
        break;
    }
    case 7: {
        u8 *base, *other, *state, *squad;
        base=D_80196AF8;
        if(H(base,0x12E)==0) H(base,0x122)++;
        break;
    }
    case 8: {
        u8 *base, *other, *state, *squad;
        func_000c54c0(1);
        func_000b9234(0);
        B(D_80196AF8,0x10A9)=0;
        base=D_80196AF8;
        H(base,0x10C4)=0;
        B(base,0x9A)=1;
        func_000b6ba8();
        B(D_80196AF8,0x99)=0;
        base=D_80196AF8;
        record=&D_80193AC0[H(base,0x1BEE + selection[0]*2)];
        if(record->count==0) {
            record->item=0;
            value=func_000bc464((u16)(B(base,0x1E00 + B(base,0x9D))-1));
            B(D_80196AF8,0x1DED)=value;
            base=D_80196AF8;
            if(B(base,0x1DED)==0) {
                B(base,0x1E00 + B(base,0x9D))=0;
                do {
                    base=D_80196AF8;
                    B(base,0x9D)=(B(base,0x9D)+1)%B(base,0x1DFF);
                    base=D_80196AF8;
                } while(B(base,0x1E00 + B(base,0x9D))==0);
                selection[0]=B(base,0x1DF6 + B(base,0x9D));
                selection[1]=B(base,0x1DEE + B(base,0x9D));
                value=func_000bc464((u16)(B(base,0x1E00 + B(base,0x9D))-1));
                B(D_80196AF8,0x1DED)=value;
                base=D_80196AF8;
                selection[3]=B(base,0x1DED)-1;
                B(base,0x1DFF)--;
                H(D_80196AF8,0x122)=99;
            } else {
                selection[3]=B(base,0x1DED)-1;
                if((u16)selection[3]<(u16)selection[1]+(u16)selection[2]-1) {
                    selection[1]=(u16)selection[1]?(u16)selection[1]-1:0;
                }
                if((u16)selection[3]<selection[0]) selection[0]=(u16)selection[3];
                H(D_80196AF8,0x122)=1;
            }
        } else H(base,0x122)=1;
        base=D_80196AF8;
        if(SH(base,0x122)==1) {
            func_000b4b08(D_80193AC0[H(base,0x1BEE + selection[0]*2)].item|0x140000);
            func_000b9234(17);
        }
        base=D_80196AF8;
        B(base,0xA0)&=127;
        func_000ae30c(10,0,0);
        break;
    }
    case 99: {
        u8 *base, *other, *state, *squad;
        if(!func_000b8e70(0x400)) {
            func_000b6ba8();
            func_000ae30c(10,0,0);
        } else {
            resources=PTR(D_80196AF8,0x1E28);
            if(resources) {
                func_000016C4(resources[0]);
                func_000016C4(resources[1]);
                func_000016C4(PTR(D_80196AF8,0x1E28));
                PTR(D_80196AF8,0x1E28)=0;
            }
            B(D_80196AF8,0x1E2C)=0;
            func_000b4bb8();
        }
        break;
    }
    }
    return;

}
