import Collection = Skype.Collection;
import ErrorCallback = Skype.ErrorCallback;

declare module Skype {
    export interface ErrorCallback { (err?: Error): void; }

    export interface Event<Listener extends Function> {
        (listener: Listener): Object;
        off(listener: Listener): void;
    }


    export interface Property<T> {
        (): T;
        (value: T, reason?: any): any;
        get: any;
        reason: any;
        set(v: any): any;
        changed: Event<Function>;
        subscribe(): Object;
        fork(set: (T, reason?: any) => Promise<T> | T): Property<T>;
        map<U>(fn: Function): Property<U>;
        once(value: T | Function, fn: Function): Object;
        when(value: T | Function, fn: Function): Object;
    }

    export interface Command {
        (...args: any[]): ((...args: any[]) => any) & any;
        bind(that: any, ...args: any[]): ((...args: any[]) => any) & any; 
        enabled: Property<boolean>;
    }

    export interface Collection<T> {
        (): T[];
        (index: number| string): T;

        add: Command;
        remove: Command;

        added: Event<Function>;
        changed: Event<Function>;

        get() : Promise<T[]>;
        get(key: string) : Promise<T>;
        get(index: number): Promise<T>;

        removed: Event<Function>;
        size: Property<number>;


        filter(predicate: Function): Collection<T>;
        fork(add: any, remove: any): Collection<T>;
        map<U>(fn: Function): Collection<U>;
        reduce<U>(aggregate: Function, initialValue?: U): Property < U > ;
        sort(order: Function): Collection<T>;
        subscribe(): Object;
    }

    type OnlineStatus = "Online" | "Offline" | "Hidden" | "Busy" | "Idle" | "BeRightBack" | "Away" | "DoNotDisturb" | "Unknown";
    type EmailType = "Personal" | "Work" | "Other";
    type EndpointType = "Desktop" | "Mobile" | "Web" |"Unknown";
    type NoteType = "Personal" | "OutOfOffice";
    type PhoneType = "Home" | "Work" | "Cell" |"Other";

    export interface Email {
        emailAddress: Property<string>;
        type: Property<EmailType>;
    }

    export interface Note {
        text: Property<string>;
        type: Property<NoteType>;
    }

    export interface PhoneNumber {
        displayString: Property<string>;
        telUri: Property<string>;
        type: Property<PhoneType>;
    }

    export interface Location extends Property<string> {
    }  

    export interface Status extends Property<OnlineStatus> {
    }

    export interface Person {
        activity: Property<string>;
        avatarUrl: Property<string>;
        capabilities: Capabilities;
        company: Property<string>;
        department: Property<string>;
        displayName: Property<string>;
        emails: Collection<Email>;
        endpointType: Property<EndpointType>;
        id: Property<string>;
        lastSeenAt: Property<Date>;
        location: Location;
        note: Note;
        office: Property<string>;
        phoneNumbers: Collection<PhoneNumber>;
        status: Status;
        title: Property<string>;
    }

    type VideoFormat = "Fit" | "Crop" | "Stretch";

    export interface StreamSink {
        container: Property<HTMLElement>;
        format: Property<VideoFormat>;
    }

    export interface MediaStreamSource {
        sink: StreamSink;
    }

    type MediaStreamState = "Started" | "Active" | "Inactive" | "Stopped";

    export interface MediaStream {
        height: Property<number>;
        width: Property<number>;
        state: Property<MediaStreamState>;
        source: MediaStreamSource;
    }

    export interface VideoChannel {
        camera: Property<string>;
        isOnHold: Property<Boolean>;
        isStarted: Property<Boolean>;
        isVideoOn: Property<Boolean>;
        stream: MediaStream;
    }


    type CallConnectionState = "Disconnected" | "Notified" | "Connecting" | "Ringing" | "Connected" | "Disconnecting";

    export interface ParticipantVideo {
        state: Property<CallConnectionState>;
        channels: Collection<VideoChannel>;
    }

    type ParticipantState = "Disconnected" | "Connecting" | "InLobby" | "Connected" | "Disconnecting";

    export interface Participant {
        person: Person;
        state: Property<ParticipantState>;
        video: ParticipantVideo;
    }

    export interface VideoService {
        start(): any;
    }

    export interface Conversation {
        participantsCount: Property<number>;
        participants: Collection<Participant>;
        state: Property<string>;
        topic: Property<string>;
        uri: Property<string>;

        videoService: VideoService;

        leave();
    }

    export interface SignInManager {
        signIn(options: any): Promise<Application>;
        signOut(): Promise<any>;
        state: Property<string>;
    }


    export interface ConversationsManager {
        getConversationByUri(uri: string): Conversation
        conversations: Collection<Conversation>;
    }

    type DeviceType = "Camera" | "Microphone" | "Speaker";

    interface Device {
        id: Property<string>;
        name: Property<string>;
        type: Property<DeviceType>;
    }

    export interface Camera extends Device {
        localVideoChannel: VideoChannel;
    }

    export interface Microphone extends Device {

    }

    export interface Speaker extends Device {
    }

    export interface Capabilities {
        audio: Property<boolean>;
        chat: Property<boolean>;
        video: Property<boolean>;
    }

    export interface MePerson  extends Person {
        email: Property<string>;
        location: Location & { reset(): Promise<void>; }
        note: Note & { reset(): Promise<void>; }
        status: Status & { reset(): Promise<void>; }
    }

    export interface DevicesManager {
        cameras: Collection<Camera>;    
        microphones: Collection<Microphone>;    
        speakers: Collection<Speaker>;    

        selectedCamera: Property<Speaker>;
        selectedMicrophone: Property<Microphone>;
        selectedSpeaker: Property<Speaker>;
    }

    export interface PersonsAndGroupsManager {
        mePerson: MePerson;
    }

    export interface ConfigurationManager {
        enablePreviewFeatures: Property<boolean>;
    }

    export interface Application {
        signInManager: SignInManager;
        conversationsManager: ConversationsManager;
        configurationManager: ConfigurationManager;
        personsAndGroupsManager: PersonsAndGroupsManager;
        devicesManager: DevicesManager;
    }

    export interface ApplicationCtor {
        new(args: any): Application;
    }

    export interface Api {
        application?: ApplicationCtor;
        UIApplicationInstance: any;
    }

    export function initialize(opts: any, success?: (api: Api) => any, fail?: ErrorCallback): void;
    export function getVersion(): string;

}

