/**
 * Типы фриспинов
 */
export enum FreeSpinsType {
    FULL_PLEASURE = 'fullPleasure',
    DOUBLE_LECHERY = 'doubleLechery',
    NORMAL = 'freespin',
}

/**
 * Тип для одного объекта фриспинов
 */
export interface FreeSpin {
    type: FreeSpinsType;
    totalWin: number;
    left: number;
    total: number;
    hash: string | null;
    bet: number;
}

/**
 * Тип структуры данных, которую принимает getFreeSpinsFromResponse
 */
export interface FreeSpinsResponse {
    double_lechery?: any[] | { [key: string]: any };
    freespin?: any[] | { [key: string]: any };
    naughty_character?: any;
    double_lechery_final?: any;
    full_pleasure?: any[] | { [key: string]: any };
} 