import { useState } from 'react';

const initialState = [
  {
    id: 118836,
    title: "Clark",
    image: "https://i.pravatar.cc/48?u=11836",
    balance: -7
  },
  {
    id: 118837,
    title: "Diana",
    image: "https://i.pravatar.cc/48?u=11837",
    balance: 20
  },
  {
    id: 118838,
    title: "Bruce",
    image: "https://i.pravatar.cc/48?u=11838",
    balance: 0
  }
]

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [friends, setFriends] = useState(initialState)
  const [selectedFriend, setSelectedFriend] = useState(null)

  const handleShowAddFriend = () => {
    setShowAddFriend((previousState) => !previousState)
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend])
    setShowAddFriend(false)
  }

  function handleSelectFriend(friend) {
    // setSelectedFriend(friend)
    console.log(friend)
    setSelectedFriend((previousState) => {
      return previousState?.id === friend.id ? null : friend
    });
    setShowAddFriend(false)
  }

  function handleSplitBill(value) {
    setFriends((friends) => friends.map((friend) =>
      friend.id === selectedFriend.id
        ? { ...friend, balance: friend.balance + value }
        : friend
      )
    )
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList 
          friends={friends} 
          selectedFriend={selectedFriend} 
          onSelectedFriend={handleSelectFriend} 
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {
            showAddFriend ? 'Cancel' : 'Add friend'
          }
        </Button>
      </div>

      {selectedFriend && <FormSplitBill 
        selectedFriend={selectedFriend} 
        onSplitBill={handleSplitBill} 
        key={selectedFriend.id} 
      />}
    </div>
  );
}

function FriendsList({ friends, selectedFriend, onSelectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend 
          friend={friend} 
          key={friend.id} 
          selectedFriend={selectedFriend} 
          onSelection={onSelectedFriend} 
        />
      ))}
    </ul>
  )
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id
  console.log(isSelected)
  console.log(selectedFriend?.id)
  console.log(friend.id)
  console.log('onSelection', onSelection)
  return (
    <li className={isSelected ? 'selected' : ""}>
      <img src={friend.image} alt={friend.title} />
      <h3>{friend.title}</h3>

      {friend.balance < 0 && <p className='red'>You owe {friend.title} {Math.abs(friend.balance)}$</p>}
      {friend.balance > 0 && <p className='green'>You owe {friend.title} {Math.abs(friend.balance)}$</p>}
      {friend.balance === 0 && <p>You and {friend.title} are even </p>}

      <Button onClick={() => {onSelection(friend)}}>{isSelected ? 'Close' : 'Select'}</Button>
    </li>
  )
}

function Button({ children, onClick }) {
  return <button className='button' onClick={onClick}>{children}</button>
}

function FormAddFriend({onAddFriend}) {
  const [name, setName] = useState('')
  const [image, setImage] = useState('https://i.pravatar.cc/48?u=11838')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name || !image) return
    const id = crypto.randomUUID();
    const newFriend = { id, name, image: `${image}?=${id}`, balance: 0 }
    onAddFriend(newFriend)
    setName('')
    setImage('https://i.pravatar.cc/48?u=11838')
  }

  return (
    <form className='form-add-friend' onSubmit={handleSubmit}>
      <label>Add new friend</label>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}  />

      <label>Image Url</label>
      <input type="text" placeholder="Image Url" value={image} onChange={(e) => setImage(e.target.value)} />

      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState('');
  const [paidByUser, setPaidByUser] = useState('');
  const [whoIsPaying, setWhoIsPaying] = useState('user');
  const paidByFriend = bill ? bill - paidByUser : '';

  function handleSubmit(e) {
    e.preventDefault()
    if (!bill || !paidByUser) return
    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser)
  }
  
  return (
    <form className='form-split-bill' onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.title}</h2>

      <label>Bill value</label>
      <input type="text" value={bill} onChange={(e) => setBill(Number(e.target.value))} />

      <label>Your expense</label>
      <input 
        type="text" 
        value={paidByUser} 
        onChange={
          (e) => setPaidByUser(Number(e.target.value) > bill 
          ? paidByUser : e.target.value)
        } 
      />

      <label>{selectedFriend.title}'s expense</label>
      <input type="text" disabled value={paidByFriend}/>

      <label>Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value='user'>You</option>
        <option value='friend'>{selectedFriend.title}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  )
}