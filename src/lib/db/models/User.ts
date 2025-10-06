
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Iuser extends Document {
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<Iuser>({
    email: {
        type: String,
        required: [true, 'Email is requiree'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
         'Please enter a valid email',
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
    },
}, {
    timestamps: true,
  }
);

//prevent model recomplication in devleopment;
 const User: Model<IUser> =  
 mongoose.models.User || mongoose.model<Iuser>('User', UserSchema);

 export default User;